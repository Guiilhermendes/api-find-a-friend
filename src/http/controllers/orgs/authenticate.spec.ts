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

    it('should be able to authenticate', async () => {
        await request(app.server).post('/orgs').send({
            email: 'emaile@example.com',
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        const response = await request(app.server).post('/sessions').send({
            email: 'emaile@example.com',
            password: '123456'
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
    })
})