import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UpdateAvatarUserService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);


upload.array

usersRouter.post('/', async (request, response) => {

        const { name, email, password } = request.body;

        const usersRepository = new UsersRepository()
        const createUser = new CreateUserService(usersRepository);

        const user = await createUser.execute({
            name,
            email,
            password,
        });
        delete user.password;

        return response.json(user);

});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async ( request, response ) => {
        const usersRepository = new UsersRepository()
        const updateUserAvatar = new UpdateAvatarUserService(usersRepository);
        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });
        delete user.password
        return response.json(user);


} );

 export default usersRouter;
