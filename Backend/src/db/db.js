const mongoose= require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connect successfully');
        

    } catch (error) {
        console.error('DB connemction is error',error)
    }
    
}

module.exports=connectDB;