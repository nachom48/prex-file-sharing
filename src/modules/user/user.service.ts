import { DataSource } from 'typeorm';
import UserEntity from './user.entity';
import { UserRepository } from './user.repository';
import CommonService from './../../common/common.service';
import { EntityAlreadyExistsException } from './../../common/exceptions/entity-already-exists-exception';
import bcrypt from 'bcryptjs';
import SignUpDTO from './../auth/dto/sign-up.dto';
import { HttpPostException } from './../../common/exceptions/http-post-exception';

export class UserService extends CommonService<UserEntity> {

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }


    public async findByIds(ids: string[]): Promise<UserEntity[]> {
        return this.userRepository.findByIds(ids); // Usar el método del repositorio
    }

    public async createUser(userData: SignUpDTO): Promise<Omit<UserEntity, 'password'>> {
        try {
            const existingUser = await this.repository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new EntityAlreadyExistsException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.repository.save({
                ...userData,
                password: hashedPassword,
                createdBy: userData.userName,
            });

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.log("este es el error creando usuario", error)
            if (error instanceof EntityAlreadyExistsException) {
                throw error;
            }
            throw new HttpPostException('Failed to create user');
        }
    }
}
