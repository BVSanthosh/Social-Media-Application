import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    });
}

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(403).json("Not logged in.")
    }

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Invalid token.")
        }

        const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";
        const values = [userInfo.id, req.body.userId];
       
        db.query(q, values, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json("Following");
        });
    })
}

export const deleteRelationship = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(403).json("Not logged in.")
    }

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) {
            return res.status(403).json("Invalid token.")
        }
        
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
        const values = [userInfo.id, req.query.userId];
        db.query(q, values, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            return res.status(200).json("Unfollowed");
        });
    })
}
/*
export const getSuggestions = (req, res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    });
}
*/