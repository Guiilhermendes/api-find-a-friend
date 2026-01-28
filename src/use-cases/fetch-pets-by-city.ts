import type { Pet } from "@prisma/client";

import type { PetsRepository } from "@/repositories/pets-repository.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface FetchPetsByCityUseCaseRequest {
    city: string
    page: number
}

interface FetchPetsByCityUseCaseResponse {
    pets: Pet[]
}

export class FetchPetsByCityUseCase {
    constructor(private petsRepository: PetsRepository, private orgsRepository: OrgsRepository) {}

    async execute({
        city,
        page
    }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
        const orgs = await this.orgsRepository.findManyByCity(city);
        if (orgs.length === 0) { throw new ResourceNotFoundError(); }

        const orgsId = orgs.map(org => org.id.toString());
        const pets = await this.petsRepository.findManyPetsByOrgs(orgsId, page);
        if (pets.length === 0) { throw new ResourceNotFoundError(); }

        return {
            pets
        }
    }
}