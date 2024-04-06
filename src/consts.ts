import { config } from 'dotenv'

config()


const {
    AWS_REGION = '',
    ENVIRONMENT = '',
    DYNAMO_DB_URI = '',
    LOGGER_DISABLE_CONSOLE_INTERCEPT = false, 
} = process.env

export {
    AWS_REGION,
    ENVIRONMENT,
    DYNAMO_DB_URI,
    LOGGER_DISABLE_CONSOLE_INTERCEPT,
}