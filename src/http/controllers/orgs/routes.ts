import type { FastifyInstance } from "fastify";

import { register } from "./register.js";
import { authenticate } from "./authenticate.js";

export async function orgsRoutes(app: FastifyInstance) {
    app.post('/orgs', register);
    app.post('/sessions', authenticate);
}