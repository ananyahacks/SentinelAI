const companyModel = require('../models/company.model')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 
}

async function registerCompany(req, res) {
    try {
        const { companyname, companyemail, username, useremail, userpassword } = req.body

        if (!companyname || !companyemail || !username || !useremail || !userpassword) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const isCompanyAlreadyExist = await companyModel.findOne({
            $or: [{ companyname }, { companyemail }]
        })
        if (isCompanyAlreadyExist) {
            return res.status(409).json({ message: "Company already exist" })
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { useremail }]
        })
        if (isUserAlreadyExist) {
            return res.status(409).json({ message: "User already Exist" })
        }

        const company = await companyModel.create({ companyname, companyemail })

        const hash = await bcrypt.hash(userpassword, 10)

        let user
        try {
            user = await userModel.create({
                username,
                useremail,
                userpassword: hash,
                role: 'ADMIN',
                company: company._id
            })
        } catch (err) {
            await companyModel.deleteOne({ _id: company._id })
            throw err
        }

        const token = jwt.sign(
            { id: user._id, companyId: user.company, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie("token", token, COOKIE_OPTIONS)

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                userid: user._id,
                companyId: company._id,
                username: user.username,
                email: user.useremail,
                role: user.role
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Something went wrong during registration" })
    }
}

async function loginCompany(req, res) {
    try {
        const { companyemail, useremail, userpassword } = req.body

        if (!useremail || !userpassword) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        let user
        let company

        if (companyemail) {
            company = await companyModel.findOne({ companyemail })
            if (!company) {
                return res.status(401).json({ message: "Company not found" })
            }
            user = await userModel.findOne({ company: company._id, useremail })
        } else {
            user = await userModel.findOne({ useremail })
            if (user) {
                company = await companyModel.findById(user.company)
            }
        }

        if (!user || !company) {
            return res.status(401).json({ message: "User or Company not found" })
        }

        const isPasswordValid = await bcrypt.compare(userpassword, user.userpassword)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign(
            { id: user._id, companyId: user.company, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie("token", token, COOKIE_OPTIONS)

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userid: user._id,
                companyId: user.company,
                username: user.username,
                email: user.useremail,
                role: user.role,
                companyName: company.companyname
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Something went wrong during login" })
    }
}

module.exports = { registerCompany, loginCompany }