import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        const { password, ...other} = data[0];

        return res.status(200).json(other);
    });
}

export const updateUser = async (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json("Not logged in.")
    }

    jwt.verify(token, "secretKey", (error, userInfo) => {
        if (error) {
            return res.status(403).json("Invalid token.")
        }

        const q = "UPDATE users SET `name` = ?, `location` = ?, `website` = ?, `profilePic` = ?, `coverPic` = ? WHERE id = ?";
        const values = [req.body.name, req.body.location, req.body.website, req.body.profilePic, req.body.coverPic, userInfo.id];
        db.query(q, values, (err, data) => {
            if (err) {  
                return res.status(500).json(err);
            }

            if (data.affectedRows > 0) {
                return res.status(200).json("Profile updated!");
            }

            return res.status(403).json("Unauthorised update");
        });
    })
}