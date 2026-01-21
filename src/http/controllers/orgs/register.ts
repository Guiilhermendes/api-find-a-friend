import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { CreateOrgUseCase } from "@/use-cases/create-org.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        street: z.string(),
        city: z.string(),
        phone_number: z.string().max(11)
    });

    const {
        email,
        password,
        street,
        city,
        phone_number
    } = registerBodySchema.parse(request.body);

    try { 
        const orgsRepository = new PrismaOrgsRepository()
        const createOrgUseCase = new CreateOrgUseCase(orgsRepository)
        await createOrgUseCase.execute({email, password, street, city, phone_number});
    } catch(error) { return reply.status(409).send(); }
    
    return reply.status(201).send()
}