import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
    constructor(
       private userRepository: IUsersRepository,
       private mailProvider: IMailProvider,
    ) {}

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExists = await this.userRepository.findByEmail(data.email);

        if(userAlreadyExists) {
            throw new Error("User already exists.");
        }
        
        const user = new User(data);

        await this.userRepository.save(user);

        this.mailProvider.sendMail({
          to: {
            name: data.name,
            email: data.email,
          },
          from: {
            name: "Testando conhecimento",
            email: "roberto.fortes@email.com",
          },
          subject: "Seja bem-vindo à plataforma",
          body: "<p>Você já pode fazer login em nossa plataforma.</p>",
        });
    }
}