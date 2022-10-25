import { Usecase } from "../UseCase";
import { UserRepository } from "../../repositories/UserRepository";
import { Validator } from "../../../domain/validator/validator";
import { Cryptography, Hash } from "../../cryptography";
import { EmailAlreadyRegisteredError } from "../../../domain/erros";

export type InputCreateUserDto = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
};

export type OutputCreateUserDto = {
  accessToken: string;
};

export class CreateUserUseCase
  implements Usecase<InputCreateUserDto, OutputCreateUserDto>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly validator: Validator,
    private readonly hash: Hash,

    private readonly cryptography: Cryptography
  ) {}
  async execute(data: InputCreateUserDto): Promise<OutputCreateUserDto> {
    this.validator.validate(data);
    const { email, password } = data;

    const user = await this.repository.findByEmail(email);
    if (user) {
      throw new EmailAlreadyRegisteredError();
    }

    const hash = await this.hash.create(password);

    const userId = await this.repository.create({
      ...data,
      password: hash,
    });

    const accessToken = await this.cryptography.encrypt(userId);

    return { accessToken };
  }
}