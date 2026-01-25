import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js"
import { AuthenticateUseCase } from "../authenticate.js";

export async function makeAuthenticateUseCase() {
    const orgsRepository = new PrismaOrgsRepository()
    const authenticateUseCase = new AuthenticateUseCase(orgsRepository);

    return authenticateUseCase;
}