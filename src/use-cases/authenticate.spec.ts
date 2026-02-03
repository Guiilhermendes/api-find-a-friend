import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        orgsRepository = new InMemoryOrgsRepository();
        sut = new AuthenticateUseCase(orgsRepository);
    })

    it('should be able to authenticate', async () => {
        const email = 'johnDoe@example.com';
        const password = '123456';

        await orgsRepository.create({
            email,
            password_hash: await hash(password, 6),
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        const { org } = await sut.execute({ email, password });

        expect(org.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () => {
        const email = 'johnDoe@example.com';
        const password = '123456';

        await orgsRepository.create({
            email,
            password_hash: await hash(password, 6),
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        await expect(
            sut.execute({ 
                email: 'johnDoe2@example.com',
                password
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    });

    it('should not be able to authenticate with wrong password', async () => {
        const email = 'johnDoe@example.com';
        const password = '123456';
 
        await orgsRepository.create({
            email,
            password_hash: await hash(password, 6),
            street: 'Av Paulista 500',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        await expect(
            sut.execute({ 
                email,
                password: '123123'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    });
});