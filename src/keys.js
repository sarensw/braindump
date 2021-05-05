import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'

const { isOptionKeyCommand } = KeyBindingUtil

/**
 * 
 * @param {SyntheticKeyboardEvent} event 
 */
function myKeyBindings (event) {
  if (event.keyCode === '38' && isOptionKeyCommand(e)) {
    console.log('yes')
  }
}