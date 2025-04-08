"use client"

import { requestNotificationPermission } from "@/lib/firebase-token";
import { getMessaging, onMessage, Unsubscribe } from "firebase/messaging";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export async function getNotificationPermissionAndToken() {
    
    if (!self.Notification){
        console.log("This browser does not support notifications.");
        return null;
    }
 
    if (Notification.permission==='granted'){
        return await requestNotificationPermission()
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission==='granted'){
            return await requestNotificationPermission()
        }
    }

    console.log("Notification permission not granted.");
    return null;

}


const useFCMToken = ()=>{
    const {status} = useSession()
    const router = useRouter()

    const [notificationPermissionStatus,setNotificationPermissionStatus] = useState<NotificationPermission|null>(null);

    const [token, setToken] = useState<string|null>(null);
    const retryLoadToken = useRef(0)
    const isLoading = useRef(false)


    const loadToken = useCallback(async ()=>{

        if(isLoading.current)return;

        isLoading.current = true

        if (status==='authenticated'){
            const token = await getNotificationPermissionAndToken();
            setToken(token!)
        }
        if (Notification.permission==='denied'){
            setNotificationPermissionStatus('denied')

            isLoading.current = false
            return ;
        }
        if (!token){
            if(retryLoadToken.current>=5){
                console.log("[Error] Exhausted max retry limit.");
                isLoading.current = false;
                return;
            }
            retryLoadToken.current+=1
            isLoading.current = false
            await loadToken();
            return;
        }

        setNotificationPermissionStatus(Notification.permission)
        setToken(token)

        isLoading.current=false
      
    }, [status, token]);

    useEffect(()=>{
        loadToken()
    },[loadToken])

    useEffect(()=>{
        let unsubscribe: Unsubscribe|null = null;

        const setupListner = async()=>{
            if(!token)return;

            console.log("onMessage listener registered.")
            const messaging = getMessaging();

            unsubscribe = onMessage(messaging,(payload)=>{
                if(Notification.permission !=='granted')return;

                console.log("FOREGROUND NOTIFICATION",payload)

                const link = payload.fcmOptions?.link || payload.data?.link

                if(link){
                    toast.info(
                        `${payload.notification?.title}:${payload.notification?.body}`,
                        {
                            action:{
                                label:"Visit",
                                onClick:()=>router.push(link)
                            }
                        }
                    )
                }
                else {
                    toast.info(
                        `${payload.notification?.title}: ${payload.notification?.body}`
                      );
                }

            })
            return unsubscribe
        }

        setupListner().then((unsub)=>{
            if(unsub){
                unsubscribe=unsub
            }
        })
        return ()=>unsubscribe?.();
    },[token,router])

    return {token,notificationPermissionStatus}

}

export default useFCMToken