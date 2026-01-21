import fastify from "fastify";
export const app = fastify();

import { petsRoutes } from "./http/controllers/pets/routes.js";
import { orgsRoutes } from "./http/controllers/orgs/routes.js";

app.register(petsRoutes)
app.register(orgsRoutes)