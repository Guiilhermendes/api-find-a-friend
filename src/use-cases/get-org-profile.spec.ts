import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { GetOrgProfileUseCase } from "./get-org-profile.js";
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: GetOrgProfileUseCase;

describe('Get Org Profile Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        sut = new GetOrgProfileUseCase(orgsRepository);
    });

    it('should be able to get org profile', async () => {
        const createdOrg = await orgsRepository.create({
            email: 'email@example.com',
            password_hash: await hash('123456', 6),
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11911223344'
        });

        const { org } = await sut.execute({orgId: createdOrg.id});

        expect(org.email).toEqual('email@example.com');
    });

    it('should not be able to get org profile with wrong id', async () => {
        await expect(
            sut.execute({orgId: randomUUID()})
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    })
});