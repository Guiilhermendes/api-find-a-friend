import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    })

    it('should be able to create', async () => {
        const response = await request(app.server).post('/orgs').send({
            email: 'email@example.com',
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        expect(response.statusCode).toEqual(201)
    });
});