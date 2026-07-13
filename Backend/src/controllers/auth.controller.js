const companyModel=require('../models/company.model')
const userModel= require('../models/user.model')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerCompany(req,res){
    const{companyname, companyemail, username, useremail, userpassword, role='ADMIN'}=req.body

    if (!companyname || !companyemail || !username || !useremail || !userpassword) {
            return res.status(400).json({ message: "Missing required fields" })
        }

    const isCompanyAlreadyExist= await companyModel.findOne({
        $or: [
            {companyname},
            {companyemail}
        ]
    })
    if (isCompanyAlreadyExist){
        return res.status(409).json({message:"Company already exist"})
    }


    const isUserAlreadyExist=await userModel.findOne({
        $or: [
            {username},
            {useremail}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({message:"User already Exist"})
    }

     const company= await companyModel.create({
        companyname,
        companyemail
    })

    const hash = await bcrypt.hash(userpassword,10)


    let user
    try{
        user=await userModel.create({
        username,
        useremail,
        userpassword: hash,
        role:'ADMIN',
        company:company._id
    })}
    catch(err){
        await companyModel.deleteOne({ _id: company._id })
            throw err
    }

    const token= jwt.sign({
        id: user._id,
        companyId: user.company,
        role:user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({message:"Registration successful",
        user:{
            userid:user._id,
            companyId:company._id,
            username: user.username,
            email: user.useremail,
            role:user.role
        }
    })
}

async function loginCompany(req,res){
    const{ companyemail,useremail, userpassword}=req.body
    
    if (!companyemail || !useremail || !userpassword) {
            return res.status(400).json({ message: "Missing required fields" })
        }

    
    const company= await companyModel.findOne({companyemail})

    if(!company){
        return res.status(401).json({message:"Company not found"})
    }
    const user= await userModel.findOne({company:company._id,useremail})

    if(!user){
        return res.status(401).json({message:"User not found"})
    }

    const isPasswordValid= await bcrypt.compare(userpassword, user.userpassword)
    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid Credentials"})
    }
    
    const token= jwt.sign({
        id: user._id,
        companyId: user.company,
        role:user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

     res.status(200).json({message:"Login successfull",
        user:{
            userid:user._id,
            companyId:user.company,
            username: user.username,
            email: user.useremail,
            role:user.role
        }
    })


}
module.exports={registerCompany, loginCompany}