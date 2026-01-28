import { beforeEach, describe, expect, it } from "vitest";

import { RegisterPetUseCase } from "./register-pet.js";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsReposutory } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

let petsRepository: InMemoryPetsReposutory;
let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterPetUseCase;

describe('Register Pet Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        petsRepository = new InMemoryPetsReposutory();
        sut = new RegisterPetUseCase(petsRepository, orgsRepository);
    });

    it('should be able to register a pet', async () => {
        const org = await orgsRepository.create({
            email: 'email@example.com',
            password_hash: await hash('123456', 6),
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        const { pet } = await sut.execute({
            name: 'Astolfo',
            about: 'Um cãozinho muito bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'HIGH',
            independence: 'MEDIUM',
            habitat: 'SPACIOUS',
            imgs_url: ['dogPicture.png'],
            requireds: ['Ossinho'],
            orgId: org.id
        });

        expect(pet.id).toEqual(expect.any(String));
    });

    it('should not be able to register a pet in the wrong org', async () => {
        await expect(
            sut.execute({
                name: 'Astolfo',
                about: 'Um cãozinho muito bonzinho',
                age: 1,
                size: 'SMALL',
                stamine: 'HIGH',
                independence: 'MEDIUM',
                habitat: 'SPACIOUS',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                orgId: randomUUID()
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
})