import admin, { ServiceAccount } from "firebase-admin";

import serviceAccount from "./firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const firebase = admin;
