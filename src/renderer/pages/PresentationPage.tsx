import React, { ReactElement, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { registerHotkey, unregisterHotkey } from '../services/hotkeyService'
import { setActivePage } from '../store/storeApp'
import { prevSlide, nextSlide, resetPresentation } from '../store/storePresentation'
import Page from './Page'

const PresentationPage: React.FunctionComponent = (): ReactElement => {
  const dispatch = useAppDispatch()
  const presentation = useAppSelector(store => store.presentation)
  const colors = useAppSelector(store => store.themeNew.colors)
  const settings = useAppSelector(store => store.settings)

  useEffect(() => {
    const escHk = {
      id: 'presentation:esc',
      key: 'esc',
      description: 'editor',
      action: (source, codeEditor): boolean => {
        dispatch(setActivePage('editor'))
        dispatch(resetPresentation())
        return true
      }
    }
    const up = {
      id: 'presentation:prev',
      key: 'up',
      description: 'prev slide',
      action: (source, codeEditor): boolean => {
        dispatch(prevSlide())
        return true
      }
    }
    const down = {
      id: 'presentation:next',
      key: 'down',
      description: 'next slide',
      action: (source, codeEditor): boolean => {
        dispatch(nextSlide())
        return true
      }
    }
    registerHotkey(up, 'files', null)
    registerHotkey(down, 'files', null)
    registerHotkey(escHk, 'editor', null)
    return () => {
      unregisterHotkey(up)
      unregisterHotkey(down)
      unregisterHotkey(escHk)
    }
  }, [])

  return (
    <Page>
      <div
        className='h-full flex'
        style={{
          padding: '6vw',
          userSelect: 'text'
        }}
      >
        {/* title slide */}
        {presentation.currentSlide === 0 &&
          <div className='flex flex-col self-center gap-8'>
            <div style={{
              fontSize: '5vw',
              fontWeight: 'bold',
              color: colors.editorTokens.header.foreground
            }}
            >
              {presentation.title}
            </div>
            <div>
              <span className='whitespace-pre-wrap'>{settings['presentation.title.subTitle']}</span>
            </div>
          </div>}
        {/* other slides */}
        {presentation.currentSlide > 0 &&
          <div>
            <div
              style={{
                marginBottom: '2vh',
                fontSize: '3.5vw',
                fontWeight: 'bold',
                color: colors.editorTokens.header.foreground
              }}
            >{presentation.slides[presentation.currentSlide].header}
            </div>
            <div
              className='whitespace-pre-wrap'
              style={{
                fontSize: '3vw'
              }}
            >
              {presentation.slides[presentation.currentSlide].content}
            </div>
          </div>}
      </div>
    </Page>
  )
}

export default PresentationPage
