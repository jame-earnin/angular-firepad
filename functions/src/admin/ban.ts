import { database } from "firebase-admin";

export async function isUserBan(uid: string) {
  const errorRef =  database().ref(`/users/${uid}/errors`);
  const val = (await errorRef.get())?.val();
  if (val && val > 10) {
    if (uid) {
      // app.auth().deleteUser(uid);
      // const userRef = app.database().ref(`/users/${context.auth?.uid}`);
      // userRef.remove();
      return true;
    }
  } else {
    await errorRef.set((val || 0) + 1);
  }
  return false;
}
