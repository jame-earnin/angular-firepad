import * as functions from 'firebase-functions';
import { Handler } from '../interface';

export const applyMiddleware = (middleware1: (arg0: functions.https.Request, arg1: any, arg2: () => any) => any) => (handler: Handler)  => (req: functions.https.Request, res: functions.Response) => {
    return middleware1(req, res, () => {
      return handler(req, res)
    })
  }
  