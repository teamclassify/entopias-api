import pkg from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
const { credential, auth } = pkg;

import { FIREBASE } from "./index.js";

initializeApp({
  credential: credential.cert(FIREBASE),
});

const authApp = auth();

export default authApp;
