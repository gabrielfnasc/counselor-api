import { Validator } from "../../../domain/validator/validator";
import {
  NotFoundHttpError,
  UnauthorizedHttpError,
} from "../../../infrastructure/http/errors";
import { Hash } from "../../cryptography";
import { UserRepository } from "../../repositories/UserRepository";
import { Usecase } from "../UseCase";
import { Cryptography } from "../../cryptography/Cryptography";

export type InputLoginDto = {
  email: string;
  password: string;
};

export type OutputLoginDto = {
  accessToken: string;
};

export class LoginUseCase implements Usecase<InputLoginDto, OutputLoginDto> {
  constructor(
    private readonly validator: Validator,
    private readonly repository: UserRepository,
    private readonly hash: Hash,
    private readonly jwt: Cryptography
  ) {}
  async execute(data: InputLoginDto): Promise<OutputLoginDto> {
    this.validator.validate(data);

    const user = await this.repository.findByEmail(data.email);
    if (!user) {
      throw new NotFoundHttpError("User not found!");
    }

    const isValid = await this.hash.comparer(data.password, user.password);
    if (!isValid) {
      throw new UnauthorizedHttpError();
    }
    const accessToken = await this.jwt.encrypt(user.id);
    return { accessToken };
  }
}
