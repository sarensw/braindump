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
  let tm = ''
  for (const arg of args) {
    tm += `[${arg}]`
  }
  tm += tm.length === 0 ? stringify(msg, null, 2) : ` ${stringify(msg, null, 2)}`
  logToMain('debug', tm)
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
