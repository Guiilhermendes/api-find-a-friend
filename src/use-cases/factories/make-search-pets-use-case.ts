import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { SearchPetsUseCase } from "../search-pets.js";
import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";

export async function makeSearchPetsUseCase() {
    const petsRepository = new PrismaPetsRepository();
    const orgsRepository = new PrismaOrgsRepository();
    const searchPetsUseCase = new SearchPetsUseCase(petsRepository, orgsRepository);

    return searchPetsUseCase;
}