import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { RegisterPetUseCase } from "../register-pet.js";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";

export function makeRegisterPetUseCase() {
    const petsRepository = new PrismaPetsRepository();
    const orgsRepository = new PrismaOrgsRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, orgsRepository);

    return registerPetUseCase;
}