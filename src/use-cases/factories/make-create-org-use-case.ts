import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js"
import { CreateOrgUseCase } from "../create-org.js"

export async function makeCreateOrgUseCase() {
    const orgsRepository = new PrismaOrgsRepository()
    const createOrgUseCase = new CreateOrgUseCase(orgsRepository);

    return createOrgUseCase;
}