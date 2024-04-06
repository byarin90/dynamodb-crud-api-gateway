import pino from 'pino'
import {
    PINO_OPTIONS,
} from './pino-options'
import { Context, ContextData } from './context'
import { interceptConsole } from './intercept-console'
import { LOGGER_DISABLE_CONSOLE_INTERCEPT } from '../../consts'

type PinoLogger = pino.Logger

type GenericOptions = {
    [key: string]: unknown
}

type Levels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'

class Logger {
    context: Context

    logger: PinoLogger

    constructor() {
        this.context = new Context()

        this.logger = pino(PINO_OPTIONS)
    }

    getLogger(): PinoLogger { return this.logger }

    addExecutionContext(context: ContextData = {}): void {
        this.context.addExecutionContext(context)
    }

    getExecutionContext(): ContextData {
        return this.context.getExecutionContext()
    }

    trace(msg: string, ...args: GenericOptions[]): void { this.logger.trace(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    debug(msg: string, ...args: GenericOptions[]): void { this.logger.debug(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    info(msg: string, ...args: GenericOptions[]): void { this.logger.info(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    warn(msg: string, ...args: GenericOptions[]): void { this.logger.warn(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    error(msg: string, ...args: GenericOptions[]): void { this.logger.error(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    fatal(msg: string, ...args: GenericOptions[]): void { this.logger.fatal(args.reduce((curr, acc) => ({ ...acc, ...curr }), { ...this.getExecutionContext() }), msg) }

    setLevel(level: Levels): void { this.logger.level = level }

    getLevel(): string { return this.logger.level }
}

if (!LOGGER_DISABLE_CONSOLE_INTERCEPT) interceptConsole((new Logger()).getLogger())

const logger = new Logger()

export {
    logger,
    Logger,
    PinoLogger,
    ContextData,
}
