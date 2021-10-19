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

const log = (level: string, msg: any, ...args: string[]): void => {
  let tm: string = ''
  for (const arg of args) {
    tm += `[${arg}]`
  }
  const isString: boolean = typeof msg === 'string'
  const s: string = isString ? msg : stringify(msg, null, 2)
  tm += tm.length === 0 ? s : ` ${s}`
  logToMain(level, tm)

  var err = new Error()
  if (err.stack !== undefined) {
    const callerLine = err.stack.split('\n')[3]
    const index = callerLine.lastIndexOf('/')
    const line = callerLine.slice(index + 1, callerLine.length)
    const match = line.match(/([\w.]*)(\?mtime=[0-9]*)?(:.*)\)+/)
    if (match !== null) {
      tm += ` (${match[1]}:${match[3]})`
    }
  }
  console.log(tm)
}

const debug = (msg: any, ...args: string[]): void => {
  log('debug', msg, ...args)
}

const info = (msg: any): void => {
  log('info', msg)
}

const warn = (msg: any): void => {
  log('warn', msg)
}

const error = (msg: any): void => {
  log('error', msg)
}

export default {
  debug,
  info,
  warn,
  error
}
