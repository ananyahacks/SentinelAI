const mongoose = require("mongoose");

const anomalySchema = new mongoose.Schema(
{
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    anomalyScore:{
        type:Number,
        required:true
    },

    isAnomaly:{
        type:Boolean,
        default:false
    },

    riskLevel:{
        type:String,
        enum:["LOW","MEDIUM","HIGH","CRITICAL"]
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Anomaly", anomalySchema);