import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { GetOrgProfileUseCase } from "../get-org-profile.js";

export function makeGetOrgProfileUseCase() {
    const orgsRepository = new PrismaOrgsRepository();
    const getOrgProfileUseCase = new GetOrgProfileUseCase(orgsRepository);

    return getOrgProfileUseCase
}