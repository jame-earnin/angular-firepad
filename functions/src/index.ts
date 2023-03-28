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
    response.json(request);
  } catch (err) {
    response.status(500);
  }
}

export const runJS = functions.https.onRequest(applyValidateToken(requestRunJS));

