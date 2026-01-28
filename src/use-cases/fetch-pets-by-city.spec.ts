import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsReposutory } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { FetchPetsByCityUseCase } from "./fetch-pets-by-city.js";

let orgsRepository: InMemoryOrgsRepository;
let petsRepository: InMemoryPetsReposutory;
let sut: FetchPetsByCityUseCase;

describe('Fetch Pets By City Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        petsRepository = new InMemoryPetsReposutory();
        sut = new FetchPetsByCityUseCase(petsRepository, orgsRepository);
    });

    it('should be able to fetch pets by city', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city: count > 2 ? 'Rio de Janeiro' : city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: 1,
                size: 'SMALL',
                stamine: 'HIGH',
                independence: 'MEDIUM',
                habitat: 'SPACIOUS',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                org_id: orgId
            });

            count++
        } while (count != 5);

        const { pets } = await sut.execute({ city, page: 1 });

        expect(pets).toHaveLength(3);
        expect(pets).toEqual([
            expect.objectContaining({ name: 'Astolfo0' }),
            expect.objectContaining({ name: 'Astolfo1' }),
            expect.objectContaining({ name: 'Astolfo2' }),
        ])
    });

    it('should be able to fetch paginated pets by city', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city: city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: 1,
                size: 'SMALL',
                stamine: 'HIGH',
                independence: 'MEDIUM',
                habitat: 'SPACIOUS',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                org_id: orgId
            });

            count++
        } while (count != 12);

        const { pets } = await sut.execute({ city, page: 2 });

        expect(pets).toHaveLength(2);
        expect(pets).toEqual([
            expect.objectContaining({ name: 'Astolfo10' }),
            expect.objectContaining({ name: 'Astolfo11' })
        ])
    });
});