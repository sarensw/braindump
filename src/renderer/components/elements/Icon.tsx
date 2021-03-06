import React, { ReactElement } from 'react'

const Icon = ({ icon, state = 'normal', height = '16', color = undefined }: { icon: string, state?: string, height?: string, color?: string | undefined }): ReactElement => {
  const getColor = (): string => {
    if (color !== undefined) return color
    if (state === 'normal') return 'rgba(107, 114, 128)'
    if (state === 'focus') return 'rgba(55, 65, 81)'
    if (state === 'selected') return 'black'
    return ''
  }

  if (icon === 'braindump') {
    return (
      <svg height={height + 'px'} x='0px' y='0px' viewBox='0 0 24 24'>
        <g>
          <g>
            <path fill={getColor()} d='M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z' />
            <polygon fill='#333' points='240.58 830.38 1.16 415.69 240.58 1 719.42 1 958.85 415.69 719.42 830.38 240.58 830.38' />
            <path fill='#333' d='M718.85,2,957.69,415.69,718.85,829.38H241.15L2.31,415.69,241.15,2h477.7M720,0H240L0,415.69,240,831.38H720L960,415.69,720,0Z' />
            <path fill='#29abe2' d='M822.28,654.23V374.87H725v223c-23.07-23.08-54.39-36-92.29-36-82.42,0-140.1,68.71-140.1,153.17,0,46.73,17.68,88.43,47.4,116.39H720ZM661.85,782.57c-39.55,0-65.92-28.16-65.92-67.58,0-40,29.11-68.14,65.92-68.14,36.26,0,65.38,28.16,65.38,68.14C727.23,754.41,699.76,782.57,661.85,782.57Z' />
            <path fill='#29abe2' d='M327.28,561.82c-37.91,0-69.23,13-92.3,36v-223H137.73V654.26L240,831.38H420c29.73-28,47.41-69.66,47.41-116.39C467.38,630.53,409.69,561.82,327.28,561.82ZM298.16,782.57c-37.91,0-65.38-28.16-65.38-67.58,0-40,29.12-68.14,65.38-68.14,36.81,0,65.93,28.16,65.93,68.14C364.09,754.41,337.72,782.57,298.16,782.57Z' />
          </g>
        </g>
      </svg>
    )
  } else if (icon === 'window_close') {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke={getColor()}>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
      </svg>
    )
  } else if (icon === 'home') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <g>
          <path fill={getColor()} d='M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z' />
        </g>
      </svg>
    )
  } else if (icon === 'analytics') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <path fill={getColor()} d='M5,12a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V13A1,1,0,0,0,5,12ZM10,2A1,1,0,0,0,9,3V21a1,1,0,0,0,2,0V3A1,1,0,0,0,10,2ZM20,16a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V17A1,1,0,0,0,20,16ZM15,8a1,1,0,0,0-1,1V21a1,1,0,0,0,2,0V9A1,1,0,0,0,15,8Z' />
      </svg>
    )
  } else if (icon === 'reload') {
    return (
      <svg height={height + 'px'} x='0px' y='0px' viewBox='0 0 24 24'>
        <g id='Filled_Icons_1_'>
          <g id='Filled_Icons'>
            <g>
              <path fill={getColor()} d='M19.395,5.697C17.592,3.665,15.001,2.5,12.286,2.5c-4.992,0-9.088,3.873-9.463,8.771L1.83,9.791 C1.523,9.333,0.9,9.208,0.442,9.519c-0.458,0.308-0.58,0.929-0.273,1.388l2.909,4.301c0.391,0.391,1.023,0.391,1.414,0 l3.267-3.904c0.354-0.424,0.297-1.054-0.127-1.408C7.209,9.54,6.579,9.597,6.225,10.021L4.8,11.727 C4.945,7.719,8.242,4.5,12.286,4.5c2.144,0,4.188,0.92,5.612,2.525c0.367,0.413,0.999,0.449,1.412,0.084 C19.724,6.743,19.761,6.111,19.395,5.697z' />
              <path fill={getColor()} d='M23.832,13.096l-2.909-4.301c-0.391-0.391-1.023-0.391-1.414,0l-3.267,3.904c-0.354,0.424-0.297,1.054,0.127,1.408 c0.424,0.354,1.054,0.298,1.408-0.127l1.425-1.706c-0.146,4.009-3.442,7.228-7.486,7.228c-2.144,0-4.189-0.92-5.612-2.525 c-0.366-0.414-1-0.451-1.412-0.084c-0.413,0.366-0.45,0.998-0.084,1.412c1.803,2.032,4.394,3.197,7.108,3.197 c4.992,0,9.088-3.873,9.463-8.771l0.993,1.48c0.307,0.458,0.93,0.583,1.388,0.273C24.018,14.176,24.14,13.555,23.832,13.096z' />
            </g>
          </g>
          <g id='New_icons' />
        </g>
      </svg>
    )
  } else if (icon === 'notepad') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <g id='Outline_Icons_1_'>
          <g id='Outline_Icons' />
          <g id='New_icons_1_'>
            <g>
              <g>
                <polygon fill='none' stroke={getColor()} strokeLinejoin='round' strokeMiterlimit='10' points='15.5,15.5 15.5,23.5 0.5,23.5 0.5,0.5 23.5,0.5 23.5,15.5 ' />
                <line fill='none' stroke={getColor()} strokeLinejoin='round' strokeMiterlimit='10' x1='23.5' y1='15.5' x2='15.5' y2='23.5' />
              </g>
              <path fill='none' stroke={getColor()} strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' d='M5,10l1-1 c0.553-0.552,1.447-0.552,2,0c0.553,0.553,1.447,0.553,2,0c0.553-0.552,1.447-0.552,2,0c0.553,0.553,1.447,0.553,2,0 c0.553-0.552,1.447-0.552,2,0c0.553,0.553,1.447,0.553,2,0l1-1' />
              <path fill='none' stroke={getColor()} strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' d='M5,15l1-1 c0.553-0.552,1.447-0.552,2,0c0.553,0.553,1.447,0.553,2,0' />
            </g>
          </g>
        </g>
        <g id='Invisible_Shape'>
          <rect fill='none' width='24' height='24' />
        </g>
      </svg>
    )
  } else if (icon === 'cog') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <path
          fill='none' stroke={getColor()} strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' d='M20.254,13.5H23.5
          v-3h-3.247c-0.209-0.867-0.551-2.181-1.003-2.922l2.296-2.295l-2.829-2.829L16.42,4.75c-0.74-0.452-2.053-0.793-2.92-1.002V0.5
          h-3v3.248C9.633,3.957,8.319,4.298,7.579,4.75L5.282,2.454L2.453,5.283L4.75,7.579C4.298,8.319,3.956,9.633,3.746,10.5H0.5v3
          h3.246c0.21,0.867,0.552,2.181,1.004,2.921l-2.297,2.297l2.829,2.828l2.296-2.297c0.741,0.454,2.055,0.795,2.922,1.005V23.5h3
          v-3.246c0.867-0.21,2.181-0.552,2.92-1.004l2.298,2.296l2.828-2.828l-2.296-2.297C19.702,15.681,20.044,14.367,20.254,13.5z'
        />

        <circle fill='none' stroke={getColor()} strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='10' cx='12' cy='12' r='4.5' />
      </svg>
    )
  } else if (icon === 'more') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <g strokeLinecap='round' strokeWidth='1' stroke={getColor()} fill='none' strokeLinejoin='round'>
          <path d='M13.7678,1.23223c0.976311,0.976311 0.976311,2.55922 0,3.53553c-0.976311,0.976311 -2.55922,0.976311 -3.53553,0c-0.976311,-0.976311 -0.976311,-2.55922 0,-3.53553c0.976311,-0.976311 2.55922,-0.976311 3.53553,-4.44089e-16' />
          <path d='M13.7678,10.2322c0.976311,0.976311 0.976311,2.55922 0,3.53553c-0.976311,0.976311 -2.55922,0.976311 -3.53553,0c-0.976311,-0.976311 -0.976311,-2.55922 0,-3.53553c0.976311,-0.976311 2.55922,-0.976311 3.53553,0' />
          <path d='M13.7678,19.2322c0.976311,0.976311 0.976311,2.55922 0,3.53553c-0.976311,0.976311 -2.55922,0.976311 -3.53553,0c-0.976311,-0.976311 -0.976311,-2.55922 0,-3.53553c0.976311,-0.976311 2.55922,-0.976311 3.53553,0' />
        </g>
      </svg>
    )
  } else if (icon === 'share') {
    return (
      <svg height={height + 'px'} viewBox='0 0 24 24'>
        <g strokeLinecap='round' strokeWidth='1' stroke={getColor()} fill='none' strokeLinejoin='round'>
          <path d='M11.5,13.5v-13' />
          <path d='M7,5l4.5,-4.5l4.5,4.5' />
          <path d='M14.5,8.5h5v15h-16v-15h5' />
        </g>
        <path fill='none' d='M0,0h24v24h-24Z' />
      </svg>
    )
  }

  return <></>
}

export default Icon
