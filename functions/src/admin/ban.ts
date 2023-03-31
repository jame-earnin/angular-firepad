import { auth, database } from "firebase-admin";

const MAX_ERRORS = 100;
export async function isUserBan(uid: string) {
  const errorRef =  database().ref(`/users/${uid}/errors`);
  const val = (await errorRef.get())?.val();
  if (val && val > MAX_ERRORS) {
    if (uid) {
      auth().deleteUser(uid);
      const userRef = database().ref(`/users/${uid}`);
      userRef.remove();
      return true;
    }
  } else {
    await errorRef.set((val || 0) + 1);
  }
  return false;
}
