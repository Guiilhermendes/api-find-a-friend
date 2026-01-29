import type { Pet, PetHabitat, PetIndependence, PetSize, PetStamina, Prisma } from "@prisma/client";

export interface PetsQueryParams {
    age?: number | undefined
    size?: PetSize | undefined
    stamine?: PetStamina | undefined
    independence?: PetIndependence | undefined
    habitat?: PetHabitat | undefined
}
export interface PetsRepository {
    findById(id: string): Promise<Pet | null>
    findManyPetsByOrgs(orgsId: string[], page: number, queryParams: PetsQueryParams): Promise<Pet[]>
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}