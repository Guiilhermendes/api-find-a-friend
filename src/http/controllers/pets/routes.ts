import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { profile } from "./profile.js";
import { search } from "./search.js";

export async function petsRoutes(app: FastifyInstance) {
    app.post('/pets', register);

    app.get('/pets/:id', profile);
    app.get('/pets/list', search);
}