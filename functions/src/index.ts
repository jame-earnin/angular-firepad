import * as functions from "firebase-functions";

import { VM } from 'vm2';
import { applyValidateToken } from "./auth/validate";


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//


const requestRunJS = (request: functions.https.Request, response: functions.Response) => {
  const { code } = request.body;
  const vm = new VM({ timeout: 5000, allowAsync: false });
  try {
    const result = vm.run(code);
    functions.logger.info(result, {structuredData: true});
    response.json(result);
  } catch (err) {
    response.status(500);
  }
}

const callableRunJS = (data: any, context: functions.https.CallableContext) => {
  const { code } = data;
  const vm = new VM({ timeout: 5000, allowAsync: false });
  try {
    const result = vm.run(code);
    functions.logger.info(result, {structuredData: true});
    return result;
  } catch (err: any) {
    return err.toString();
  }
}

export const runJS = functions.https.onRequest(applyValidateToken(requestRunJS));

export const runCallableJS = functions.https.onCall(callableRunJS)
