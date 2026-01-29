import type { FastifyInstance } from "fastify";

import { create } from "./create.js";
import { authenticate } from "./authenticate.js";

export async function orgsRoutes(app: FastifyInstance) {
    app.post('/orgs', create);
    app.post('/sessions', authenticate);
}