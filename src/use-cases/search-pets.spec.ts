import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsReposutory } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { SearchPetsUseCase } from "./search-pets.js";
import { randomUUID } from "node:crypto";

let orgsRepository: InMemoryOrgsRepository;
let petsRepository: InMemoryPetsReposutory;
let sut: SearchPetsUseCase;

describe('Fetch Pets By City Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        petsRepository = new InMemoryPetsReposutory();
        sut = new SearchPetsUseCase(petsRepository, orgsRepository);
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

    it('should not found any pet with nonexistent city', async () => {
        const city: string = 'São Paulo';

        await petsRepository.create({
            name: 'Astolfo',
            about: 'Um cãozinho muito bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'HIGH',
            independence: 'MEDIUM',
            habitat: 'SPACIOUS',
            imgs_url: ['dogPicture.png'],
            requireds: ['Ossinho'],
            org_id: randomUUID()
        });

        const { pets } = await sut.execute({ city, page: 1 });

        expect(pets).toHaveLength(0);
    });

    it('should not found pets cause not has pets in the city', async () => {
        const city: string = 'São Paulo';

        await orgsRepository.create({
            email: 'email@example.com',
            password_hash: '123456',
            street: 'Av Paulista 500',
            city: city,
            phone_number: '11911223344'
        });

        await petsRepository.create({
            name: 'Astolfo',
            about: 'Um cãozinho muito bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'HIGH',
            independence: 'MEDIUM',
            habitat: 'SPACIOUS',
            imgs_url: ['dogPicture.png'],
            requireds: ['Ossinho'],
            org_id: randomUUID()
        });

        const { pets } = await sut.execute({ city, page: 1 });

        expect(pets).toHaveLength(0);
    });

    it('should be able to fetch pets by age less than 3', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: count+1,
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

        const { pets } = await sut.execute({ city, page: 1, age: 3 });

        expect(pets).toHaveLength(3);
        expect(pets).toEqual([
            expect.objectContaining({ age: 1 }),
            expect.objectContaining({ age: 2 }),
            expect.objectContaining({ age: 3 }),
        ])
    });

    it('should be able to fetch pets by size equal SMALL', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: count+1,
                size: count % 2 === 0 ? 'SMALL' : 'LARGE',
                stamine: 'HIGH',
                independence: 'MEDIUM',
                habitat: 'SPACIOUS',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                org_id: orgId
            });

            count++
        } while (count != 5);

        const { pets } = await sut.execute({ city, page: 1, size: 'SMALL' });

        expect(pets).toHaveLength(3);
    });

    it('should be able to fetch pets by any differents filters', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: count+1,
                size: count % 2 === 0 ? 'SMALL' : 'LARGE',
                stamine: count % 2 === 0 ? 'HIGH' : 'LOW',
                independence: count % 2 === 0 ? 'MEDIUM' : 'LOW',
                habitat: count % 2 === 0 ? 'SPACIOUS' : 'FREE',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                org_id: orgId
            });

            count++
        } while (count != 5);

        const { pets } = await sut.execute({ city, page: 1, stamine: 'HIGH', age: 2, habitat: 'SPACIOUS' });

        expect(pets).toHaveLength(1);
    });

    it('should found any pets cause filters returned nothing', async () => {
        const city: string = 'São Paulo';

        let count = 0;
        do {
            const orgId = `org-0${count}`;

            await orgsRepository.create({
                id: orgId,
                email: `email${count+1}@example.com`,
                password_hash: '123456',
                street: `Av Paulista 50${count}`,
                city,
                phone_number: `1191122334${count}`
            });

            await petsRepository.create({
                name: `Astolfo${count}`,
                about: 'Um cãozinho muito bonzinho',
                age: count+1,
                size: count % 2 === 0 ? 'SMALL' : 'LARGE',
                stamine: count % 2 === 0 ? 'HIGH' : 'LOW',
                independence: count % 2 === 0 ? 'MEDIUM' : 'LOW',
                habitat: count % 2 === 0 ? 'SPACIOUS' : 'FREE',
                imgs_url: ['dogPicture.png'],
                requireds: ['Ossinho'],
                org_id: orgId
            });

            count++
        } while (count != 5);

        const { pets } = await sut.execute({ city, page: 1, stamine: 'HIGH', age: 2, habitat: 'FREE' });

        expect(pets).toHaveLength(0);
    });
});