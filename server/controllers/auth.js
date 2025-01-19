import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const register = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q,[req.body.username], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (data.length) {
            return res.status(409).json("User already exists");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassoword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?, ?, ?, ?)";
        const values = [req.body.username, req.body.email, hashedPassoword, req.body.name];

        db.query(q, values, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json("User has been created!");
        })
    });
}

export const login = async (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, req.body.username, (err, data) => {
        if (err) {
            return res.status(500).json (err);
        }

        if (data.length == 0) {
            return res.status(404).json("User not found.")
        }

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) {
            return res.status(400).json("Wrong password or username.")
        }

        const { password, ...other } = data[0];
        const token = jwt.sign({ id: other.id }, "secretKey");

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other);
    });
}

export const logout = async (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out!");
}