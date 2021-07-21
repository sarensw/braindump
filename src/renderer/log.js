
const logToMain = (type, msg) => {
  window.__preload.log({
    type,
    msg
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
