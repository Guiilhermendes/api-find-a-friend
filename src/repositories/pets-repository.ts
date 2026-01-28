import type { Pet, Prisma } from "@prisma/client";

export interface PetsRepository {
    findManyPetsByOrgs(orgsId: string[], page: number): Promise<Pet[]>
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}