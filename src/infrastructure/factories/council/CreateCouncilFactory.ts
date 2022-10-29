import { CreateCouncilUseCase } from "../../../application/usecase/council/business/CreateCouncilUseCase";
import { ValidatorComposite } from "../../../application/validator/ValidatorComposite";
import { ValidatorRequiredParam } from "../../../application/validator/ValidatorRequiredParam";
import { ValidatorRequiredParamObject } from "../../../application/validator/ValidatorRequiredParamObject";
import { BaseController } from "../../controllers/BaseController";
import { CreateCouncilController } from "../../controllers/council/CreateCouncilController";
import { CouncilRepositoryMongoDb } from "../../database/mongodb/CouncilRepositoryMongoDb";
import { TypeRepositoryMongoDb } from "../../database/mongodb/TypeRepositoryMongoDb";
import { UserRepositoryMongoDB } from "../../database/mongodb/UserRepositoryMongoDb";

export class CreateCouncilFactory {
  static build(): BaseController {
    const validatorRequest = new ValidatorComposite([
      new ValidatorRequiredParam("userId"),
      new ValidatorRequiredParam("council"),
    ]);

    const validatorUseCase = new ValidatorComposite([
      new ValidatorRequiredParamObject("council", "content"),
      new ValidatorRequiredParamObject("council", "type"),
    ]);
    const userRepo = new UserRepositoryMongoDB();

    const businessCouncilRepo = new CouncilRepositoryMongoDb();

    const typeRepo = new TypeRepositoryMongoDb();

    const usecase = new CreateCouncilUseCase(
      validatorUseCase,
      userRepo,
      businessCouncilRepo,
      typeRepo
    );

    return new CreateCouncilController(validatorRequest, usecase);
  }
}
