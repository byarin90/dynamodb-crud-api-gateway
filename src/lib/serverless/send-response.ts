import { SendResponse } from "../../types/serverless-types"

const sendResponse: SendResponse = (statusCode = 200, body = {}, headers = {}) => new Promise((resolve) => {
  resolve({
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
})

export default sendResponse
