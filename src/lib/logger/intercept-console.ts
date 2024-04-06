import pino from 'pino'

type Levels = ['log', 'debug', 'info', 'warn', 'error']

interface Originals {
  log?: Console['log']
  debug?: Console['debug'],
  info?: Console['info'],
  warn?: Console['warn'],
  error?: Console['error'],
}

type InterceptConsole = (logger: pino.Logger, levels?: Levels) => void

const interceptConsole: InterceptConsole = (logger, levels = ['log', 'debug', 'info', 'warn', 'error']) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useLogger: (level: string) => (...args: any[]) => void = (level) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const log = (logger[level] ?? logger.info).bind(logger)

    return (...args) => {
      if (args.length > 0) {
        if (typeof args[0] === 'string' && typeof args[1] === 'object') {
          log(args[1], args[0], ...args.slice(2))
        } else {
          log(args[0], ...args.slice(1))
        }
      } else {
        log(args[0])
      }
    }
  }

  const originals: Originals = {}

  levels.forEach((level) => {
    originals[level] = console[level] // eslint-disable-line
    Object.assign(console, {
      [level]: useLogger(level),
    })
  })
}

// eslint-disable-next-line import/prefer-default-export
export { interceptConsole }
