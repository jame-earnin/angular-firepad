import * as functions from "firebase-functions";

import { VM } from 'vm2';
import { applyValidateToken } from "./auth/validate";

import { isUserBan } from "./admin/ban";
import * as admin from "firebase-admin";

admin.initializeApp();

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
    return { result: String(result), logs };
  } catch (err: any) {
    throw Error(err);
  }
}

const requestRunJS = async (request: functions.https.Request, response: functions.Response) => {
  const { user, code } = request.body;
  try {
    const result = runCodeInVM(code)
    response.json(result)
  } catch (err) {
    const banned = await isUserBan(user!.uid);
    if (banned) {
      response.status(403);
    }
    response.status(500);
  }
}

const callableRunJS = async (data: any, context: functions.https.CallableContext) => {
  try {
    const { code } = data;
    const result = runCodeInVM(code);
    return result;
  } catch (err: any) {
    const banned = await isUserBan(context.auth!.uid);
    if (banned) {
      return { error: 'You are banned' };
    }
    return { error: err.toString() };
  }
}

export const runJS = functions.region('asia-southeast1').runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 5,
  memory: "128MB",
  maxInstances: 100,
}).https.onRequest(applyValidateToken(requestRunJS));

export const runCallableJS = functions.region('asia-southeast1').runWith({
  // Ensure the function has enough memory and time
  // to process large files
  timeoutSeconds: 5,
  memory: "128MB",
  maxInstances: 100,
}).https.onCall(callableRunJS)
