import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            console.log("Authentication parameter missing");
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            username,
            email,
            authentication: {
                password: authentication(salt, password),
                salt
            },
        });
        return res.sendStatus(200).json(user).end();
    } catch (error) {
        console.log("Authentication error =>", error);
        return res.status(400);
    }
}