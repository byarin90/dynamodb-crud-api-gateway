import { AUTH0_API_IDENTIFIER } from '../../consts'
import { logger } from '../logger'
import parseBody from './parse-body'

interface ParsedRequestObject {
    name?: string
    clientId?: string
    userId?: string
    headers: Record<string, any>
    params: Record<string, any>
    query: Record<string, any>
    body: Record<string, any>
    rawBody: string
  }
  
  type GetRequestFromEvent = (event: Record<string, any>) => ParsedRequestObject
  

const getRequestFromEvent: GetRequestFromEvent = (event) => {
  const {
    requestContext, headers, pathParameters, queryStringParameters, body,
  } = event

  let clientId
  let userId
  let name

  if (requestContext?.authorizer?.jwt?.claims) {
    const {
      sub: spaUserId,
      azp: appId,
      [`${AUTH0_API_IDENTIFIER}/userId`]: m2mUserId,
      [`${AUTH0_API_IDENTIFIER}/clientId`]: appMetadataClientId,
      [`${AUTH0_API_IDENTIFIER}/name`]: customName,
      [`${AUTH0_API_IDENTIFIER}/useEncoding`]: customUseEncoding,
    } = requestContext.authorizer.jwt.claims

    name = customName
    userId = m2mUserId ?? spaUserId
    clientId = appMetadataClientId ?? appId

  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lowerCasedHeaders: Record<string, any> = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.entries(headers ?? {}).forEach(([key, val]: [string, any]) => {
    lowerCasedHeaders[key.toLowerCase()] = val
  })

  logger.addExecutionContext({
    name,
    clientId,
    userId,
    userAgent: lowerCasedHeaders['user-agent'],
    ip: lowerCasedHeaders['cf-connecting-ip'],
  })


  const req: ParsedRequestObject = {
    name,
    clientId,
    userId,
    headers: lowerCasedHeaders,
    params: pathParameters ?? {},
    query: queryStringParameters ?? {},
    body: body ? parseBody(body) : {},
    rawBody: body,
  }

  return req
}

export default getRequestFromEvent
