import UserEntity from "modules/user/user.entity"
import SignUpDTO from "../dto/sign-up.dto"
import { FindOneOptions } from "typeorm"


export default interface IAuthUserService{
    createUser : (userData: SignUpDTO) => Promise<Omit<UserEntity, "password">>,
    findOne : (options: FindOneOptions<UserEntity>) => Promise<UserEntity | null>
}