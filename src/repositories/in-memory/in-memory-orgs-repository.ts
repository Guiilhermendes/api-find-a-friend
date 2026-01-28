import { type Org, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { OrgsRepository } from "../orgs-repository.js";

export class InMemoryOrgsRepository implements OrgsRepository {
    public items: Org[] = []

    async findManyByCity(city: string) {
        return this.items.filter(item => item.city === city);
    }

    async findById(id: string) {
        const org = this.items.find(item => item.id === id);
        return org ?? null;
    }

    async findByEmail(email: string) {
        const org = this.items.find(item => item.email === email);
        return org ?? null;
    }

    async create(data: Prisma.OrgCreateInput) {
        const org = {
            id: data.id ?? randomUUID(),
            email: data.email,
            password_hash: data.password_hash,
            street: data.street,
            city: data.city,
            phone_number: data.phone_number,
            role: data.role ?? "MEMBER",
            create_at: new Date()
        }
        
        this.items.push(org);
        return org;
    }
}