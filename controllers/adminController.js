const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const index = (req, res) => {
    res.render("index");
};

const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, email, password: hashedPassword });
        await admin.save();
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during sign-up");
    }
};

const login = (req, res) => {
    res.render("login");
};

const Login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).send("Username not found");
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password");
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.redirect("/admins");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during login");
    }
};


const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.render("admin", { admins });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
};


const logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("An error occurred during logout");
        }
        res.clearCookie('token');
        res.redirect('/login');
    });
};

const changePassword = async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send("Admin not found");
        }
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect current password");
        }
        admin.password = await bcrypt.hash(newPassword, 10);
        await admin.save();
        return res.redirect("admins");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating password");
    }
};

module.exports = {
    index,
    signUp,
    getAdmins,
    login,
    Login,
    logout,
    changePassword
};
