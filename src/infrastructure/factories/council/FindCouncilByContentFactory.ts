import { FindCouncilByContentUseCase } from "../../../application/usecase/council/FindCouncilByContentUseCase";
import { BaseController } from "../../controllers/BaseController";
import { FindCouncilByContentController } from "../../controllers/council/FindCouncilByContentController";
import { CouncilRepositoryMongoDb } from "../../database/mongodb/CouncilRepositoryMongoDb";

export class FindCouncilByContentFactory {
  static build(): BaseController {
    const repo = new CouncilRepositoryMongoDb();
    const usecase = new FindCouncilByContentUseCase(repo);
    return new FindCouncilByContentController(usecase);
  }
}