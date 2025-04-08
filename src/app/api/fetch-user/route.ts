import connectToDB from "@/lib/db";
import { User } from "@/models/user.model";

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest){
await connectToDB()
const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET})

try {
    if (!token){
    return NextResponse.json({
        message:"TOKEN NOT FOUND",
        statusCode:"401"
    })
    }
    
    const users =await User.find({
        _id:{$ne:token._id}
    }).select("email name")
    
    if (!users || users.length===0){
        return NextResponse.json({
            message:"USER NOT FOUND",
            statusCode:"401"
        })
    }
    return NextResponse.json({
        message:"ALL USERS",
        statusCode:"401",
        data : users
    })
} catch (error) {
    return NextResponse.json({
        message:"ALL USERS",
        statusCode:"401",
        data : error
    })
}
}