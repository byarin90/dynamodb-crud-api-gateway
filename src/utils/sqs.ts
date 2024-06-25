import { SQS_DEV_SUBSCRIBE_ENDPOINT } from '../consts'
import SQS from '../lib/queue/sqs'

const sqs = new SQS({ devSubscribeEndpoint: SQS_DEV_SUBSCRIBE_ENDPOINT})

export default sqs
