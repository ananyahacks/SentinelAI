const mongoose = require('mongoose')
const companySchema= new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        unique: true
    },

    companyemail: {
        type: String,
        required: true,
        unique: true
    },
},
    {
        timestamps:true
    }
);

const companyModel = mongoose.model("company",companySchema)
module.exports=companyModel;