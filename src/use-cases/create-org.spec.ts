import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js';
import { CreateOrgUseCase } from './create-org.js';
import { compare } from 'bcryptjs';
import { OrgAlreadyExistsError } from './errors/org-alreary-exists-error.js';

let orgsRepository: InMemoryOrgsRepository;
let sut: CreateOrgUseCase;

describe('Create Org Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        sut = new CreateOrgUseCase(orgsRepository);
    });

    it('should be able to create a org', async () => {
        const { org } = await sut.execute({
            email: 'email@example.com',
            password: '123456',
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        expect(org.id).toEqual(expect.any(String));
    });

    it('should hash org password upon registration', async () => {
        const password: string = '123456';

        const { org } = await sut.execute({
            email: 'email@example.com',
            password,
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        const isPasswordCorrectlyHashed = await compare(password, org.password_hash);

        expect(isPasswordCorrectlyHashed).toEqual(true);
    });


    it('should not be able to create with same email twice', async () => {
        const email: string = 'email@example.com';
        
        await sut.execute({
            email,
            password: '123456',
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        await expect(() =>
            sut.execute({
                email,
                password: '123456',
                street: 'Av Paulista 500',
                city: 'São Paulo',
                phone_number: '11911223344'
            })
        ).rejects.instanceOf(OrgAlreadyExistsError)
    });
});