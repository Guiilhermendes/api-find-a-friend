import { prisma } from "@/lib/prisma.js";
import { Prisma, type Org } from "@prisma/client";
import type { OrgsRepository } from "../orgs-repository.js";

export class PrismaOrgsRepository implements OrgsRepository {
    async findById(id: string) {
        const org = await prisma.org.findUnique({
            where: {
                id
            }
        });

        return org;
    }

    async findByEmail(email: string) {
        const org = await prisma.org.findUnique({
            where: {
                email
            }
        });

        return org;
    }

    async create(data: Prisma.OrgCreateInput) {
        const org = await prisma.org.create({
            data
        });

        return org;
    }
}