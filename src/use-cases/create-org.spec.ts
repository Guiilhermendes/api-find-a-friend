import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository.js';
import { CreateOrgUseCase } from './create-org.js';

let orgsRepository: InMemoryOrgsRepository;
let sut: CreateOrgUseCase;

describe('Create Org Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        sut = new CreateOrgUseCase(orgsRepository);
    });

    it('should to be able to create a org', async () => {
        const { org } = await sut.execute({
            email: 'email@example.com',
            password: '123456',
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        expect(org.id).toEqual(expect.any(String));
    });
});