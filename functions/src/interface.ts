import * as functions from 'firebase-functions';

export type Handler = (req: functions.https.Request, res: functions.Response<any>) => any;