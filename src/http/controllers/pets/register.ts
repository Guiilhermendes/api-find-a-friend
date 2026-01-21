import { prisma } from "@/lib/prisma.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        about: z.string(),
        age: z.int(),
        size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
        stamine: z.enum(['LOW', 'MEDIUM', 'HIGH']),
        independence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
        habitat: z.enum(['SPACIOUS', 'LIMITED', 'ENCLOSED', 'FREE']),
        imgs_url: z.array(z.string()),
        requireds: z.array(z.string())
    });
    
    const {
        name,
        about,
        age,
        size,
        stamine,
        independence,
        habitat,
        imgs_url,
        requireds
    } = registerBodySchema.parse(request.body);

    const org_id = randomUUID(); //Temporary

    await prisma.pet.create({
        data: {
            name,
            about,
            age,
            size,
            stamine,
            independence,
            habitat,
            imgs_url,
            requireds,
            org_id
        }
    });

    return reply.status(201).send()
}