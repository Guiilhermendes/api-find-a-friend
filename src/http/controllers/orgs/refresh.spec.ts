import { app } from '@/app.js';
import request from 'supertest';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Token (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to refresh a token', async () => {
        const email: string = 'email@example.com';

        await request(app.server)
        .post('/orgs')
        .send({
            email,
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });

        const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email,
            password: '123456'
        });

        const cookies = authResponse.get('Set-Cookie') ?? [];

        const response = await request(app.server)
        .patch('/token/refresh')
        .set('Cookie', cookies)
        .send();
        
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ]);
    });
});