import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateAvatarUserService from '@modules/users/services/UpdateUserAvatarService';
import AuthenticateUserService from '@modules/users/services/AthenticateUserService';


export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
        name,
        email,
        password,
    });
    delete user.password;

    return response.json(user);
  }
  public async create(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar =  container.resolve(UpdateAvatarUserService);
    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
    });
    delete user.password
    return response.json(user);
  }
}
