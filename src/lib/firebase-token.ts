import { messaging } from "./firebase";
import {  getToken, onMessage } from "firebase/messaging"
import axios from 'axios'

export const requestNotificationPermission = async ()=>{
   
 try {
     const permission = await Notification.requestPermission();
     if(permission==='granted'){
      
       if (!messaging) {
           throw new Error("Failed to initialize Firebase Messaging");
       }
       const token = await getToken(messaging, {
           vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
       });
   
       const res = await axios.post('/api/firebase-token',{fcmToken:token})
       console.log(res)
       return token;
   
      
     }
     else if (permission==='denied'){
       alert("you will not able to get notifications");
     }
 } catch (error) {
    console.error("Error getting notification permission", error);
 }
}

export const onMessageListner = ()=>{
    new Promise((resolve)=>{
        onMessage(messaging,(payload)=>{
            console.log("FOREGROUND NOTIFICATION",payload)
            return resolve(payload)
        })
    })
}

