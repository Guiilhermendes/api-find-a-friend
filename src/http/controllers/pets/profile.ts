import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js";
import { makeGetPetProfileUseCase } from "@/use-cases/factories/make-get-pet-profile-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    const profileParamsSchema = z.object({
        id: z.string().uuid()
    });

    const { id } = profileParamsSchema.parse(request.params);

    try {
        const getPerProfileUseCase = makeGetPetProfileUseCase();
        const { pet } = await getPerProfileUseCase.execute({ petId: id });
        return reply.status(200).send({ pet });
    } catch(error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: error.message });
        }

        return error;
    }
}