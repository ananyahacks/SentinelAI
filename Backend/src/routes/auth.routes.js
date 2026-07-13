const express= require('express')

const authController=require('../controllers/auth.controller')
const router=express.Router()

router.post('/register',authController.registerCompany)
router.post('/login',authController.loginCompany)
router.get("/test",(req,res)=>{
    res.json({
        message:"successfull backend connection"
    })
})
module.exports=router