import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import log from '../log'
import { FocusElement, FocusElementType, setFocusElement } from '../store/storeApp'
import useStatic from './useStatic'

type KeyAction = (to: (id: string) => void) => void

interface HandledKeys {
  ArrowDown?: KeyAction
  ArrowUp?: KeyAction
  Enter?: KeyAction
  Escape?: KeyAction
  CmdCtrl_J?: KeyAction
  CmdCtrl_K?: KeyAction
  CmdCtrl_P?: KeyAction
  CmdCtrl_R?: KeyAction
}

interface FocusElementKeyHandler extends FocusElement {
  keys: HandledKeys
  focusRef?: React.RefObject<HTMLElement>
  onFocus?: () => void
  beforeFocus?: () => boolean
}

function useKeyboardNavigation (
  id: string,
  type: FocusElementType,
  keys: HandledKeys,
  focusRef?: React.RefObject<HTMLElement>,
  onFocus?: () => void,
  beforeFocus?: () => boolean
): {
    to: (id: string) => void
    prev: () => void
    handle: (key: string, ctrlOrCmd: boolean, shift: boolean, alt: boolean) => void
  } {
  const dispatch = useAppDispatch()
  const focusElement = useAppSelector(state => state.app.focusElement)
  const platform = useAppSelector(state => state.app.platform)
  const staticStoreElements = useStatic<FocusElementKeyHandler>('app.focusElements')
  const staticStoreHierarchy = useStatic<string>('app.focusElementsHierachy')
  const currentIdentifier = id

  if (type === FocusElementType.Page) {
    staticStoreHierarchy.remove('page')
    staticStoreHierarchy.remove('element')
    staticStoreHierarchy.store('page', id)
  }

  useEffect(() => {
    staticStoreElements.store(id, {
      id,
      type,
      keys,
      focusRef,
      onFocus,
      beforeFocus
    })

    return () => {
      staticStoreElements.remove(id)
    }
  }, [])

  const to = (id: string): void => {
    if (currentIdentifier === id) return

    const fe = staticStoreElements.retrieve(id)
    if (fe != null) {
      let canBeFocused = true
      if (fe.beforeFocus != null) {
        canBeFocused = fe.beforeFocus()
      }
      if (canBeFocused) {
        dispatch(setFocusElement({
          id: fe.id,
          type: fe.type
        }))
        if (focusRef?.current instanceof HTMLInputElement) {
          focusRef?.current?.blur()
        }
      }
    }
  }

  const prev = (): void => {
    // dispatch(setPreviousFocusElement())
  }

  const handle = (key: string, ctrlOrCmd: boolean, shift: boolean, alt: boolean): void => {
    shortcutHandler(key, ctrlOrCmd, shift, alt)
  }

  const keydownHandler = (e: KeyboardEvent): void => {
    log.debug(`key detected: ${e.key}, ctrl: ${String(e.ctrlKey)}, meta: ${String(e.metaKey)}, shift: ${String(e.shiftKey)}, alt: ${String(e.altKey)}`)

    // The Meta key on Mac (command key) and the Ctrl key on Windows/Linux
    // are equivalent. So we have to check the platform first, then see
    // whether Meta/Ctrl was pressed, and then map that to the keyboard
    // key 'C_'
    let isCmdCtrl = false
    if (platform === 'darwin' && e.metaKey) isCmdCtrl = true
    if (platform !== 'darwin' && e.ctrlKey) isCmdCtrl = true

    shortcutHandler(e.key, isCmdCtrl, e.shiftKey, e.altKey, e)
  }

  const shortcutHandler = (key: string, ctrlOrCmd: boolean, shift: boolean, alt: boolean, e: KeyboardEvent | null = null): void => {
    log.debug(`key detected: ${key}, ctrlOrCmd: ${String(ctrlOrCmd)}, shift: ${String(shift)}, alt: ${String(alt)}`)

    let keyId = key
    if (ctrlOrCmd) keyId = `CmdCtrl_${key.toUpperCase()}`

    const action = keys[keyId] as KeyAction
    if (action == null) {
      // there is no action available, so let's check if this is an
      // element and propagate the event to that page -> maybe the
      // page will react on it
      if (type === FocusElementType.Element) {
        const parent = staticStoreHierarchy.retrieve('page')
        // const parent = focusElementHierarchy.find(e => e.type === FocusElementType.Page)
        if (parent != null) {
          const focusElement = staticStoreElements.retrieve(parent)
          if (focusElement == null) {
            // no parent, thus, ignore the key
          } else {
            // parent found, check all the keys to see if this can be handled
            const pageKeys = focusElement.keys
            const pageAction = pageKeys[keyId] as KeyAction
            if (pageAction != null) {
              e?.preventDefault()
              pageAction(to)
            }
          }
        }
      }
    } else {
      e?.preventDefault()

      action(to)

      // if (e?.target instanceof HTMLInputElement) {
      //   e?.target.blur()
      // }
    }
  }

  useEffect(() => {
    log.debug(`init useKeyboardNavigation ${id}`)
  }, [])

  useEffect(() => {
    if (focusElement == null) {
      log.error('focus element became null')
      return
    }

    if (focusElement.id === id) {
      if (focusElement.type === FocusElementType.Element) {
        staticStoreHierarchy.store('element', id)
      }

      if (focusElement.id === id) {
        focusRef?.current?.focus()
      }

      window.addEventListener('keydown', keydownHandler)

      // give the event to the component that it received the focus
      if (onFocus != null) onFocus()
    } else {
      window.removeEventListener('keydown', keydownHandler)
    }

    return () => {
      window.removeEventListener('keydown', keydownHandler)
    }
  }, [focusElement])

  return { to, prev, handle }
}

export { useKeyboardNavigation }
