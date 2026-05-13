import User from "../models/user.js";
import bcrypt from "bcryptjs";

// UPDATE ROLE
export const updateRole = async (req, res) => {
    const { userId, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    );

    res.json(updatedUser);
};

// GET PROFILE
export const getProfile = async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    res.json(user);
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true }
    ).select("-password");

    res.json(updatedUser);
};

export const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Current password incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};