import type { Pet, PetHabitat, PetIndependence, PetSize, PetStamina } from "@prisma/client";

import type { PetsQueryParams, PetsRepository } from "@/repositories/pets-repository.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface SearchPetsUseCaseRequest {
    city: string,
    age?: number
    size?: PetSize
    stamine?: PetStamina
    independence?: PetIndependence
    habitat?: PetHabitat
    page: number
}

interface SearchPetsUseCaseResponse {
    pets: Pet[]
}

export class SearchPetsUseCase {
    constructor(private petsRepository: PetsRepository, private orgsRepository: OrgsRepository) {}

    async execute({
        city,
        age,
        size,
        stamine,
        independence,
        habitat,
        page
    }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
        const orgs = await this.orgsRepository.findManyByCity(city);

        const orgsId = orgs.map(org => org.id.toString());
        const queryParams: PetsQueryParams = {}

        if (age !== undefined) { queryParams.age = age; }
        if (size !== undefined) { queryParams.size = size; }
        if (stamine !== undefined) { queryParams.stamine = stamine; }
        if (independence !== undefined) { queryParams.independence = independence; }
        if (habitat !== undefined) { queryParams.habitat = habitat; }

        const pets = await this.petsRepository.findManyPetsByOrgs(orgsId, page, queryParams);

        return {
            pets
        }
    }
}