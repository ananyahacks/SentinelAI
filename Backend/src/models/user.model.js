const mongoose= require('mongoose')

const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },

    useremail:{
        type:String,
        required:true,
        unique:true
    },

    userpassword: {
        type:String,
        required:true,
    },

    role:{
        type:String,
        enum:['ADMIN', 'SECURITY_ANALYST'],
        default: 'ADMIN'
    },
    company:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"company",
        required:true
    }
})

const userModel= mongoose.model("user", userSchema)                                                                     
module.exports=userModel;