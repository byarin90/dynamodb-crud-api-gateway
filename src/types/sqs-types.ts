/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface BatchOptions {
    batchId: string,
    batchCount: number,
  }
  
  interface Message<Body> extends BatchOptions {
    messageId: string,
    body: Body,
    eventSource: string,
    eventSourceARN: string,
    attributes?: {
      timestamp: Date,
      [x: string]: any,
    },
  }
  
  type SqsGetQueueUrl = (queueName: string) => Promise<string>
  type SqsPublish = (queueName: string, messages: Record<any, any>[], batchOptions?: BatchOptions) => Promise<void>
  type SqsHandleEvent = (callback: Function, message: Record<any, any>) => Promise<void>
  type SqsSubscribe = (callback: Function, queue?: string | null) => Promise<void>
  
  export {
    Message,
    SqsGetQueueUrl,
    SqsPublish,
    SqsHandleEvent,
    SqsSubscribe,
  }
  