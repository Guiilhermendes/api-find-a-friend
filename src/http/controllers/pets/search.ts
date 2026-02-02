import { makeSearchPetsUseCase } from "@/use-cases/factories/make-search-pets-use-case.js";
import { PetHabitat, PetIndependence, PetSize, PetStamina } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const listQuerySchema = z.object({
        city: z.string(),
        age: z.coerce.number().optional(),
        size: z.enum(PetSize).optional(),
        stamine: z.enum(PetStamina).optional(),
        independence: z.enum(PetIndependence).optional(),
        habitat: z.enum(PetHabitat).optional(),
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
            ...(age !== undefined && { age }),
            ...(size !== undefined && { size }),
            ...(stamine !== undefined && { stamine }),
            ...(independence !== undefined && { independence }),
            ...(habitat !== undefined && { habitat }),
            page
        });
        return reply.status(200).send({pets});
    } catch(error) { throw error }
}