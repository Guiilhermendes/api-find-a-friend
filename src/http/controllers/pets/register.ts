import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js";
import { makeRegisterPetUseCase } from "@/use-cases/factories/make-register-pet-use-case.js";
import { PetHabitat, PetIndependence, PetSize, PetStamina } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        about: z.string(),
        age: z.int(),
        size: z.enum(PetSize),
        stamine: z.enum(PetStamina),
        independence: z.enum(PetIndependence),
        habitat: z.enum(PetHabitat),
        imgs_url: z.array(z.string()),
        requireds: z.array(z.string()),
        orgId: z.string().uuid()
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
        requireds,
        orgId
    } = registerBodySchema.parse(request.body);
    
    try {
        const registerPetUseCase = makeRegisterPetUseCase();
        await registerPetUseCase.execute({
            name,
            about,
            age,
            size,
            stamine,
            independence,
            habitat,
            imgs_url,
            requireds,
            orgId
        });
        return reply.status(201).send()
    } catch(error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        return error;
    }
}