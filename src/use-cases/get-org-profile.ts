import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import type { Org } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface getOrgProfileUseCaseRequest {
    orgId: string
}

interface getOrgProfileUseCaseResponse {
    org: Org
}

export class GetOrgProfileUseCase {
    constructor(private orgRepository: OrgsRepository) {}

    async execute({ orgId }: getOrgProfileUseCaseRequest): Promise<getOrgProfileUseCaseResponse> {
        const org = await this.orgRepository.findById(orgId);
        if (!org) { throw new ResourceNotFoundError(); }
        
        return { 
            org
        };
    } 
}