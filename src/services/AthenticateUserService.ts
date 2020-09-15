import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign , verify } from 'jsonwebtoken';
import User from "../models/User";
import { response } from 'express';


interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password}: Request): Promise<Response> {
        const usersRepository = getRepository(User);
        
        const user = await usersRepository.findOne({where: {email}});

        if (!user) {
            throw new Error('Incorrect email/password combination');
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new Error('Incorrect email/password combination');
        }
        const token = sign({}, '5ffc58ae0de7e0180420fad9a8a19af3', {
            subject: user.id,
            expiresIn: '1d',

        });

        return { user, token };
    }
}

export default AuthenticateUserService;