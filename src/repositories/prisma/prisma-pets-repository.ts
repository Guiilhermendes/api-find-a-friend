import { Prisma, type Pet } from "@prisma/client";
import type { PetsRepository } from "../pets-repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaPetsRepository implements PetsRepository {
    async findManyPetsByOrgs(orgsId: string[], page: number) {
        const pets = await prisma.pet.findMany({
            where: {
                org_id: { in: orgsId }
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