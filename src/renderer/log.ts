import stringify from 'json-stringify-safe'

const logToMain = (type: string, msg: string): void => {
  const message = (typeof msg === 'object' && msg !== null ? stringify(msg, null, 2) : msg)
  window.__preload.send({
    channel: 'log',
    payload: {
      type,
      message
    }
  })
}

const debug = (msg: string, ...args: string[]): void => {
  let tm = ''
  for (const arg of args) {
    tm += `[${arg}]`
  }
  const s = stringify(String(msg), null, 2)
  tm += tm.length === 0 ? String(s) : ` ${String(s)}`
  logToMain('debug', tm)
}

const info = (msg: string): void => {
  logToMain('info', msg)
}

const warn = (msg: string): void => {
  logToMain('warn', msg)
}

const error = (msg: string): void => {
  logToMain('error', msg)
}

export default {
  debug,
  info,
  warn,
  error
}
