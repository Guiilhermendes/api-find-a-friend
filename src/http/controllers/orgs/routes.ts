import type { FastifyInstance } from "fastify";

import { create } from "./create.js";
import { authenticate } from "./authenticate.js";
import { profile } from "./profile.js";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { refresh } from "./refresh.js";

export async function orgsRoutes(app: FastifyInstance) {
    app.post('/orgs', create);
    app.post('/sessions', authenticate);

    app.patch('/token/refresh', refresh)

    //Authenticated
    app.get('/me', { onRequest: [verifyJWT] } , profile);
}