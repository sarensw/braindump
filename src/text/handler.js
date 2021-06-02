import taskHandler from './handlerTask'

const handleTextInput = (editor, data) => {
  // task handler
  taskHandler.handleNewTask(editor, data)
  taskHandler.handleToggleTask(editor, data)
}

export default {
  handleTextInput
}
