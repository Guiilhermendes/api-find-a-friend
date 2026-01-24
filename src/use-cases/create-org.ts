import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "./errors/org-alreary-exists-error.js";
import type { Org } from "@prisma/client";

interface CreateOrgUseCaseRequest {
    email: string
    password: string
    street: string
    city: string
    phone_number: string
}

interface CreateOrgUseCaseResponse {
    org: Org
}

export class CreateOrgUseCase {
    constructor(private orgsRepository: OrgsRepository) {}

    async execute({email, password, street, city, phone_number}: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
        const password_hash = await hash(password, 6);

        const orgWithSameEmail = await  this.orgsRepository.findByEmail(email);

        if (orgWithSameEmail) { throw new OrgAlreadyExistsError(); }

        const org = await this.orgsRepository.create({
            email,
            password_hash,
            street,
            city,
            phone_number
        });

        return { org }
    }
}