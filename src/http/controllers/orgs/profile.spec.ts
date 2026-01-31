import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Authenticate (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get org profile', async () => {
        const email: string = 'email@example.com';

        await request(app.server).post('/orgs').send({
            email,
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        const { body } = await request(app.server).post('/sessions').send({
            email,
            password: '123456'
        });
        const { token } = body;

        const response = await request(app.server).get('/me').set('Authorization', `Bearer ${token}`).send();
        expect(response.statusCode).toEqual(200);
        expect(response.body.org).toEqual(expect.objectContaining({ email }));
    })
})