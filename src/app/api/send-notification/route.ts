import connectToDB from "@/lib/db";
import admin from "@/lib/firebase-admin";
import { User } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
try {
    
        await connectToDB()
        const token =  await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    
        if (!token) {
            return NextResponse.json({
              message: "Authentication required. Please log in to continue.",
              statusCode: 401,
              success: false,
            });
          }
      
        const {users}  =await req.json()
        let userFCMTokens = [];
    
        for (const email in users){
           console.log("User email",users[email])

            const user= await User.findOne({email:users[email]})
            console.log("User::",user)
            const tokens = user?.fcmTokens
            console.log("user Token",tokens)
            if(tokens?.length!==0){
             userFCMTokens.push(tokens)
            }
        }
    
        userFCMTokens = userFCMTokens.flat()
        console.log("TOKENS;;",userFCMTokens)
    
    
        const MESSAGE_DATA = {
            title:"TEST MESSAGE",
            message:"HELLO, Welcome Back",
    
        }
        const link = `/about`
        
        const payload:admin.messaging.MulticastMessage = {
            tokens:userFCMTokens.filter((token): token is string => token !== undefined),
            notification:{
                title:MESSAGE_DATA.title,
                body:MESSAGE_DATA.message
            },
            webpush:link? {
                fcmOptions:{
                    link,
                }
            }:undefined
        };
        console.log("THIS IS ADMIN::",admin.credential.refreshToken)

        // const message = {
        //     token: "fh2Os6BlqTTd9CUR3XiUeu:APA91bFP3J3hiTIrO7zWabjfcY8DV0Y0sSil3gmiFYVXTFO0Z-lBMUGAYk6PE832NmUCzCwlaQKT5SyCY4mv-R5UjL_SD7u9-WS7SiiMnPFwFAm8symzHIg",
        //     notification: {
        //       title: "HII",
        //       body: "HII HOW ARE YOU",
        //     },

        //     data: {
        //       customKey: "customValue"
        //     }
        //   };
        // const res1=await admin.messaging().send(message)
        // console.log("RES 1;:::",res1)

        const res = await admin.messaging().sendEachForMulticast(payload)
    
        return NextResponse.json({
            message: "Successfully sent a notification",
            statusCode: 200,
            success: true,
            data:{res:res}
          });
} catch (error) {
    return NextResponse.json({
        message: "Something went wrong",
        statusCode: 500,
        success: false,
        error: error instanceof Error ? error.message||error.stack :"Error Message"
      });
}
    
}