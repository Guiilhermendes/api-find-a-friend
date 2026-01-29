import { Prisma, type Pet } from "@prisma/client";
import type { PetsQueryParams, PetsRepository } from "../pets-repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaPetsRepository implements PetsRepository {
    async findById(id: string) {
        const pet = await prisma.pet.findUnique({
            where: {
                id
            }
        });

        return pet;
    }

    async findManyPetsByOrgs(orgsId: string[], page: number, queryParams: PetsQueryParams) {
        const pets = await prisma.pet.findMany({
            where: {
                org_id: { in: orgsId },
                ...(queryParams.age && { age: { lte: queryParams.age } }),
                ...(queryParams.size && { size: queryParams.size }),
                ...(queryParams.stamine && { stamine: queryParams.stamine }),
                ...(queryParams.independence && { independence: queryParams.independence }),
                ...(queryParams.habitat && { habitat: queryParams.habitat }),
            },
            take: 10,
            skip: (page - 1) * 10,
        });

        return pets;
    }

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet = await prisma.pet.create({
            data
        });

        return pet;
    }
}