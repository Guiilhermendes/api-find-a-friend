import { prisma } from "@/lib/prisma.js";
import { Prisma, type Org } from "@prisma/client";
import type { OrgsRepository } from "../orgs-repository.js";

export class PrismaOrgsRepository implements OrgsRepository {
    async findByEmail(email: string) {
        const org = await prisma.org.findUnique({
            where: {
                email
            }
        });

        return org
    }

    async create(data: Prisma.OrgCreateInput) {
        const org = await prisma.org.create({
            data
        });

        return org;
    }
}