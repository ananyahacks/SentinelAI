const userModel = require("../models/user.model");
const companyModel = require("../models/company.model")
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
    try {
        const { username, useremail, userpassword, role } = req.body;

        const exists = await userModel.findOne({ useremail });

        if (exists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(userpassword, 10);

        const user = await userModel.create({
            username,
            useremail,
            userpassword: hash,
            role: role || "SECURITY_ANALYST",
            company: req.user.companyId
        });

        const { userpassword: _omit, ...safeUser } = user.toObject();
        res.status(201).json({ message: "User Created", user: safeUser });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await userModel.find({ company: req.user.companyId }).select("-userpassword");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getUser(req, res) {
    try {
        const user = await userModel
            .findOne({
                _id: req.params.id,
                company: req.user.companyId
            })
            .select("-userpassword");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    try {
        const updates = req.body;
        delete updates.userpassword;
        const user = await userModel.findOneAndUpdate(
            { _id: req.params.id, company: req.user.companyId },
            updates,
            { new: true }
        ).select("-userpassword");

        if (!user) { return res.status(404).json({ message: "User not found" }); }

        res.json({ message: "Updated Successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        const user = await userModel.findOneAndDelete({ _id: req.params.id, company: req.user.companyId });

        if (!user) { return res.status(404).json({ message: "User not found" }); }

        res.json({ message: "User Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };