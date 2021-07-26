import stringify from 'json-stringify-safe'

const logToMain = (type, msg) => {
  const message = (typeof msg === 'object' && msg !== null ? stringify(msg, null, 2) : msg)
  window.__preload.send({
    channel: 'log',
    payload: {
      type,
      message
    }
  })
}

const debug = (msg, ...args) => {
  let message = ''
  for (const arg of args) {
    message += `[${arg}]`
  }
  message += message.length === 0 ? msg : ` ${msg}`
  logToMain('debug', message)
}

const info = msg => {
  logToMain('info', msg)
}

const warn = msg => {
  logToMain('warn', msg)
}

const error = msg => {
  logToMain('error', msg)
}

export default {
  debug,
  info,
  warn,
  error
}
