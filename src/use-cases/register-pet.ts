import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import type { PetsRepository } from "@/repositories/pets-repository.js";
import type { Pet, PetHabitat, PetIndependence, PetSize, PetStamina } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface RegisterPetUseCaseRequest {
    name: string
    about: string
    age: number
    size: PetSize
    stamine: PetStamina
    independence: PetIndependence
    habitat: PetHabitat
    imgs_url: string[]
    requireds: string[]
    orgId: string
}

interface RegisterPetUseCaseResponse {
    pet: Pet
}

export class RegisterPetUseCase {
    constructor(private petsRepository: PetsRepository, private orgsRepository: OrgsRepository) {}

    async execute({
        name,
        about,
        age,
        size,
        stamine,
        independence,
        habitat,
        imgs_url,
        requireds,
        orgId
    }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
        const org = await this.orgsRepository.findById(orgId);
        if (!org) { throw new ResourceNotFoundError(); }

        const pet = await this.petsRepository.create({
            name,
            about,
            age,
            size,
            stamine,
            independence,
            habitat,
            imgs_url,
            requireds,
            org_id: orgId
        });
        
        return {
            pet
        };
    }
}