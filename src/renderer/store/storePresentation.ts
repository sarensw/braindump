import { createSlice } from '@reduxjs/toolkit'

interface Slide {
  header: string
  content: string
}

interface PresentationState {
  content: string
  currentSlide: number
  title: string
  slides: Slide[]
}

const initialState: PresentationState = {
  content: '',
  currentSlide: 0,
  title: '',
  slides: []
}

export const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    setPresentationContent: (state, action): void => {
      const content: string = action.payload

      // set the full content
      state.content = action.payload

      // split the content into slides
      const lines = content.split(/\r?\n/)
      const slides: Slide[] = []
      const maxCharsPerSlide = 376 // 47 characters * 8 lines
      let currentHeader = ''
      let currentSlide: Slide = { header: '', content: '' }
      let currentSlideCharacterCount = 0
      for (const line of lines) {
        // title
        if (line.match(/^#{1} .*/) !== null) {
          currentSlide.header = line
          state.title = line

          slides.push(currentSlide)
          currentSlide = { header: '', content: '' }
          currentSlideCharacterCount = 0

          continue
        }

        // new sub-title means new slide
        if (line.match(/^#{2,6} .*/) !== null) {
          slides.push(currentSlide)

          currentSlide = { header: '', content: '' }
          currentSlideCharacterCount = 0
          currentSlide.header = line
          currentHeader = line

          continue
        }

        // add current line to current slide
        if (currentSlideCharacterCount === 0 && line.length === 0) {
          // ignore empty lines as first lines
          continue
        } else if (currentSlideCharacterCount + line.length > maxCharsPerSlide) {
          // new slide as the content would exceed the max chars per slide
          slides.push(currentSlide)
          currentSlide = { header: currentHeader, content: '' }

          currentSlideCharacterCount = line.length
          currentSlide.content += line
        } else {
          if (currentSlideCharacterCount > 0) currentSlide.content += '\n'
          currentSlide.content += line
          currentSlideCharacterCount += line.length
        }
      }
      slides.push(currentSlide)

      state.slides = slides
    },
    resetPresentation: (state): void => {
      state.content = initialState.content
      state.currentSlide = initialState.currentSlide
      state.title = ''
      state.slides = []
    },
    nextSlide: (state): void => {
      if (state.currentSlide < state.slides.length - 1) state.currentSlide += 1
    },
    prevSlide: (state): void => {
      if (state.currentSlide > 0) state.currentSlide -= 1
    }
  }
})

export const { setPresentationContent, resetPresentation, nextSlide, prevSlide } = presentationSlice.actions
export default presentationSlice.reducer
