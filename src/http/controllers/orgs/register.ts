import { OrgAlreadyExistsError } from "@/use-cases/errors/org-alreary-exists-error.js";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case.js";
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
        const createOrgUseCase = await makeRegisterUseCase();
        await createOrgUseCase.execute({email, password, street, city, phone_number});
    } catch(error) {
        if (error instanceof OrgAlreadyExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        
        return error;
    }
    
    return reply.status(201).send()
}