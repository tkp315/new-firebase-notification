import admin from 'firebase-admin'
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_KEY!
)

if(!admin.apps.length){
    admin.initializeApp({credential:
        admin.credential.cert(serviceAccount)
    })
    console.log("APP INITIALISED")
}
else {
    console.log("APP NOT INITIALISED")
}

export default admin