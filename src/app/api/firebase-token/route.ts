import connectToDB from "@/lib/db";
import { User } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){
  try {
      await connectToDB()
      const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET})
  
      if (!token){
          return NextResponse.json({
              message: "You are not logged in",
              statusCode: 401,
              success: false,
            });
      }
      const {fcmToken} = await req.json()

      if(!fcmToken){
        NextResponse.json({
            message: "Token not found",
              statusCode: 401,
              success: false,
        })
      }
      console.log(fcmToken)
      const user = await User.findById(token._id);
       console.log(user)
      if(!user?.fcmTokens.includes(fcmToken)){
          user?.fcmTokens.push(fcmToken)
      }
      await user?.save()
      return NextResponse.json({
          message:"Token saved",
          statusCode:200,
          success:true
        })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
        message:"Something went wrong",
        statusCode:500,
        success:false
      })
  }
}