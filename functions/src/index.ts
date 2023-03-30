import * as functions from "firebase-functions";

import { VM } from 'vm2';
import { applyValidateToken } from "./auth/validate";


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//

const runCodeInVM = (code: string) => {
  let logs = '';
  const vm = new VM({ timeout: 1000, allowAsync: false, sandbox: {
    console: {
      log: (...args: any[]) => {
        if (args?.length) {
          logs += args.join('\n')
        } else {
          logs += 'undefined';
        }
        logs += '\n'
      }
    },
  }, eval: false });
  try {
    const result = vm.run(code);
    functions.logger.info(result, {structuredData: true});
    functions.logger.info(logs, {structuredData: true});
    return { result, logs };
  } catch (err: any) {
    throw Error(err);
  }
}


const requestRunJS = (request: functions.https.Request, response: functions.Response) => {
  try {
    const { code } = request.body;
    const result = runCodeInVM(code)
    response.json(result)
  } catch (err) {
    response.status(500);
  }
}

const callableRunJS = (data: any, context: functions.https.CallableContext) => {
  try {
    const { code } = data;
    const result = runCodeInVM(code);
    return result;
  } catch (err: any) {
    return err.toString();
  }
}

export const runJS = functions.https.onRequest(applyValidateToken(requestRunJS));

export const runCallableJS = functions.https.onCall(callableRunJS)
