import mongoose from "mongoose"

interface isDbConnected{
    connectionState:boolean
}

const dbConnectionState:isDbConnected={
    connectionState:false
}
 async function connectToDB() {

    if (!dbConnectionState.connectionState){
        const res = await mongoose.connect(process.env.DB_URL!)

        dbConnectionState.connectionState=res.connection.readyState==1
    }
    
    else{
        console.log("DB ALREADY CONNECTED")
    }
}

export default connectToDB