const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone
        }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role, phone } = req.body;
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: "User is already register with us" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, email, password: hashedPassword, role, phone
        });
        res.status(201).json({
            message: "User registered successfully",
            userInfo: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone
            },
            token: generateToken(user)
        });


    } catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }

}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existinguser = await User.findOne({ email });
        if (!existinguser) {
            return res.status(400).json({ message: "User is not registered with use" });
        }
        const matchPassword = await bcrypt.compare(password, existinguser.password);
        const user = existinguser && matchPassword;
        if (user) {
            return res.status(200).json({
                message: "User Logged Successfully",
                userInfo: {
                    _id: existinguser.id,
                    email: existinguser.email,
                    username: existinguser.username,
                    role: existinguser.role,
                    phone: existinguser.phone
                }, token: generateToken(existinguser)
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}

exports.getuserList = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied Admin Only" })
        }
        const users = await User.find().select("-password");
        res.status(200).json({
            message: "User List",
            totalUser: users.length,
            users
        });
    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error ${error.message}` });
    }
}