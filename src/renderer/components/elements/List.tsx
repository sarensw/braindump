import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation'
import { FocusElementType } from '../../store/storeApp'

interface ListProps<T> {
  items: T[]
  focusId: string
  prevFocusId?: string
  nextFocusId?: string
  onSelected?: (item: T) => void
  onClick?: (item: T) => void
  display: (item: T, index: number) => ReactNode
}

const List: <T>(props: ListProps<T>) => ReactElement = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const refSelectedIndex = useRef(-1)
  const refContainer: React.RefObject<HTMLDivElement> = useRef(null)
  const items = props.items.map((item, index) => {
    return {
      ...item,
      __idx: index,
      __ref: React.createRef<HTMLLIElement>()
    }
  })
  const refItems = useRef(items)
  refItems.current = items
  console.log(selectedIndex)
  console.log(items)

  const { to } = useKeyboardNavigation(
    props.focusId, // id,
    FocusElementType.Element,
    {
      ArrowDown: (to) => {
        if (refSelectedIndex.current < items.length - 1) {
          refSelectedIndex.current = refSelectedIndex.current + 1
          setSelectedIndex(s => s + 1)
        }
      },
      ArrowUp: (to) => {
        if (refSelectedIndex.current <= 0) {
          refSelectedIndex.current = -1
          setSelectedIndex(-1)
          if (props.prevFocusId != null) to(props.prevFocusId)
        } else {
          refSelectedIndex.current = refSelectedIndex.current - 1
          setSelectedIndex(s => s - 1)
        }
      },
      Enter: (to) => {
        if (props.onClick == null) return
        if (refSelectedIndex.current < 0 || refSelectedIndex.current > items.length - 1) return
        props.onClick(props.items[refSelectedIndex.current])
        refSelectedIndex.current = -1
        setSelectedIndex(-1)
      }
    },
    undefined,
    () => {
      if (selectedIndex < 0) {
        refSelectedIndex.current = 0
        setSelectedIndex(0)
      }
    },
    () => {
      console.log('in beforeFocus')
      console.log(refItems.current.length)
      if (refItems.current.length <= 0) return false
      return true
    }
  )

  useEffect(() => {
    if (items == null || refContainer.current == null) return
    if (selectedIndex < 0 || selectedIndex > items.length - 1) return
    if (items[selectedIndex].__ref == null) return

    const element = items[selectedIndex].__ref.current
    const container = refContainer.current
    if (element != null && container != null) {
      if (element.getBoundingClientRect().top < container.getBoundingClientRect().top) {
        element.scrollIntoView()
      } else if (element.getBoundingClientRect().bottom > container.getBoundingClientRect().bottom) {
        element.scrollIntoView(false)
      }
    }
  }, [selectedIndex])

  return (
    <>
      <div ref={refContainer} className='overflow-y-auto'>
        <ul>
          {items.map((item, index) =>
            <li
              ref={item.__ref}
              key={index}
              className={
                (selectedIndex === index ? 'bg-white' : '')
              }
              onClick={() => {
                refSelectedIndex.current = index
                setSelectedIndex(index)
                to(props.focusId)
                console.log('onClick')
              }}
            >
              {props.display(item, index)}
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export { List }
