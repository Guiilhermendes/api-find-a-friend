import fastify from "fastify";
export const app = fastify();
import fastifyCookie from '@fastify/cookie';

import { petsRoutes } from "./http/controllers/pets/routes.js";
import { orgsRoutes } from "./http/controllers/orgs/routes.js";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import fastifyJwt from "@fastify/jwt";

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    },
    sign: {
        expiresIn: '10m'
    }
});

app.register(fastifyCookie);

app.register(petsRoutes)
app.register(orgsRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({message: 'Validadtion error.', issue: error.format()});
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        //TODO: Here we should log to an external tool like datadog/sentry
    }

    return reply.status(500).send({message: 'Internal server error.'});
})