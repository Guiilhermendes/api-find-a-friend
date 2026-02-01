import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { GetPetProfileUseCase } from "../get-pet-profile.js";

export function makeGetPetProfileUseCase() {
    const petsRepository = new PrismaPetsRepository();
    const getPetProfileUseCase = new GetPetProfileUseCase(petsRepository);

    return getPetProfileUseCase;
}