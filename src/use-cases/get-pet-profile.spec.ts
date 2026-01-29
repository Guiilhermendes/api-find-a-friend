import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsReposutory } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { GetPetProfileUseCase } from "./get-pet-profile.js";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

let petsRepository: InMemoryPetsReposutory;
let sut: GetPetProfileUseCase;

describe('Get Pet Profile Use Case', () => {
    beforeEach(() => {
        petsRepository = new InMemoryPetsReposutory();
        sut = new GetPetProfileUseCase(petsRepository);
    });

    it('should be able to get pet profile', async () => {
        const petId = randomUUID();

        await petsRepository.create({
            id: petId,
            name: 'Astolfo',
            about: 'Um cãozinho muito bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'HIGH',
            independence: 'MEDIUM',
            habitat: 'SPACIOUS',
            imgs_url: ['dogPicture.png'],
            requireds: ['Ossinho'],
            org_id: 'ordId-1'
        });

        const { pet } = await sut.execute({petId: petId});
        
        expect(pet.name).toEqual('Astolfo');
    });

    it('should be able to get pet profile with wrong ID', async () => {
        await expect(
            sut.execute({petId: randomUUID()})
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
});