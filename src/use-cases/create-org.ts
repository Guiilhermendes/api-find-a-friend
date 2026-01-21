import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { hash } from "bcryptjs";

interface CreateOrgUseCaseRequest {
    email: string
    password: string
    street: string
    city: string
    phone_number: string
}

export class CreateOrgUseCase {
    constructor(private orgsRepository: OrgsRepository) {}

    async execute({email, password, street, city, phone_number}: CreateOrgUseCaseRequest) {
        const password_hash = await hash(password, 6);

        const orgWithSameEmail = await  this.orgsRepository.findByEmail(email);

        if (orgWithSameEmail) {
            throw new Error('E-mail already exists.')
        }

        await this.orgsRepository.create({
            email,
            password_hash,
            street,
            city,
            phone_number
        })
    }
}