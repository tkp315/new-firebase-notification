
import { initializeApp } from "firebase/app";
import { getMessaging,  Messaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};
console.log(firebaseConfig)
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let messaging:Messaging;

if(typeof window !=='undefined'){
    messaging=  getMessaging(app)
}
export {messaging}