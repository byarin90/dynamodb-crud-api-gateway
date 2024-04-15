import joi from 'joi'
import axios from 'axios'
import { TransformedError, TransformError } from '../../types/serverless-types'

class StandardError extends Error {
  type: string

  statusCode: number

  constructor(message: string, type?: string, statusCode?: number) {
    super(message)

    this.type = type ?? 'INTERNAL_ERROR'
    this.statusCode = statusCode ?? 500
  }
}

const transformError: TransformError = (e) => {
  const error = {} as TransformedError

  if (e instanceof joi.ValidationError) {
    // Joi
    error.statusCode = 400
    error.type = 'CLIENT_ERROR'
    error.message = JSON.stringify(e.details?.map((obj) => obj.message) ?? 'Validation error')
  } else if (axios.isAxiosError(e)) {
    // Axios
    error.statusCode = Number(e.response?.status ?? 500)
    error.type = 'CLIENT_ERROR'
    error.message = JSON.stringify(e.response?.data)
  } else {
    // new StandardError() || new Error()
    error.statusCode = e?.statusCode ?? e?.status ?? 500
    error.type = e?.type ?? 'INTERNAL_ERROR'
    error.message = e?.message ?? 'An unexpected server error has occurred'
  }

  error.stack = e?.stack ?? 'Stack unavailable'

  return error
}

export {
  StandardError,
  transformError,
  TransformedError,
}
