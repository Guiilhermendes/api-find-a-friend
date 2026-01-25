import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { AuthenticateUseCase } from "@/use-cases/authenticate.js";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const orgsRepository = new PrismaOrgsRepository();
        const authenticateUseCase = new AuthenticateUseCase(orgsRepository);
        await authenticateUseCase.execute({ email, password });
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: error.message });
        }

        return error;
    }

    return reply.status(200).send();
}