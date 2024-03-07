import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const handleAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
  
