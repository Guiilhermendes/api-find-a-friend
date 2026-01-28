import type { Prisma, Pet } from "@prisma/client";
import type { PetsRepository } from "../pets-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryPetsReposutory implements PetsRepository {
    public items: Pet[] = [];

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet: Pet = {
            id: randomUUID(),
            name: data.name,
            about: data.about,
            age: data.age,
            size: data.size,
            stamine: data.stamine,
            independence: data.independence,
            habitat: data.habitat,
            imgs_url: Array.isArray(data.imgs_url) ? data.imgs_url : [],
            requireds: Array.isArray(data.requireds) ? data.requireds : [],
            create_at: new Date(),
            org_id: data.org_id
        }

        this.items.push(pet);
        return pet;
    }
}