import { makeSearchPetsUseCase } from "@/use-cases/factories/make-search-pets-use-case.js";
import { PetHabitat, PetIndependence, PetSize, PetStamina } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const listQuerySchema = z.object({
        city: z.string(),
        age: z.coerce.number(),
        size: z.enum(PetSize),
        stamine: z.enum(PetStamina),
        independence: z.enum(PetIndependence),
        habitat: z.enum(PetHabitat),
        page: z.coerce.number().default(1)
    });

    const { 
        city,
        age,
        size,
        stamine,
        independence,
        habitat,
        page
    } = listQuerySchema.parse(request.query);

    try {
        const searchPetsUseCase = makeSearchPetsUseCase();
        const { pets } = await searchPetsUseCase.execute({
            city,
            age,
            size,
            stamine,
            independence,
            habitat,
            page
        });
        return reply.status(200).send({pets});
    } catch(error) { throw error }
}