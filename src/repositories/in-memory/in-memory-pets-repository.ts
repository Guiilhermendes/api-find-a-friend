import type { Prisma, Pet } from "@prisma/client";
import type { PetsQueryParams, PetsRepository } from "../pets-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryPetsReposutory implements PetsRepository {
    public items: Pet[] = [];

    async findById(id: string) {
        return this.items.find(item => item.id === id) ?? null;
    }

    async findManyPetsByOrgs(orgsId: string[], page: number, queryParams: PetsQueryParams) {
        let petsFound = this.items.filter(item => orgsId.includes(item.org_id));
        if (Object.keys(queryParams).length > 0) {
            for (const [key, value] of Object.entries(queryParams)) {
                petsFound = petsFound.filter(pet => {
                    if (key === 'age') {
                        return Number(pet.age) <= Number(value);
                    } else {
                        return pet[key as keyof Pet] === value
                    }
                })
            }
        }
        
        return petsFound.slice((page - 1) * 10, page * 10);
    }

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet: Pet = {
            id: data.id ?? randomUUID(),
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