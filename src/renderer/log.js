import stringify from 'json-stringify-safe'

const logToMain = (type, msg) => {
  const message = (typeof msg === 'object' && msg !== null ? stringify(msg, null, 2) : msg)
  window.__preload.log({
    type,
    message
  })
}

const debug = msg => {
  logToMain('debug', msg)
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
