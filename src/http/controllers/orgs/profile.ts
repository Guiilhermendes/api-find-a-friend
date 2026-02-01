import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js";
import { makeGetOrgProfileUseCase } from "@/use-cases/factories/make-get-org-profile-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getOrgProfileUseCase = makeGetOrgProfileUseCase();
        const { org } = await getOrgProfileUseCase.execute({orgId: request.user.sub});
        return reply.status(200).send({
            org: {
                ...org,
                password_hash: undefined
            }
        });
    } catch(error) {
        if (error instanceof ResourceNotFoundError) {
            reply.status(404).send({message: error.message})
        }

        return error;
    }
}