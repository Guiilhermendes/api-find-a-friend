import request from 'supertest';
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from '@/lib/prisma.js';

describe('Search (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it.only('should be able to search many pets', async () => {
        await request(app.server).post('/orgs').send({
            email: 'email@example.com',
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });
        const org = await prisma.org.findFirst();

        await request(app.server).post('/pets').send({
            name: 'Astolfo',
            about: 'Um cão muito bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'LOW',
            independence: 'LOW',
            habitat: 'SPACIOUS',
            imgs_url: ['image.jpg'],
            requireds: ['ossos'],
            orgId: org?.id
        });

        await request(app.server).post('/pets').send({
            name: 'Betovem',
            about: 'Um cão do bom',
            age: 2,
            size: 'MEDIUM',
            stamine: 'MEDIUM',
            independence: 'MEDIUM',
            habitat: 'LIMITED',
            imgs_url: ['image.jpg'],
            requireds: ['ossos', 'cazinha'],
            orgId: org?.id
        });

        await request(app.server).post('/pets').send({
            name: 'Carnoldo',
            about: 'Um cão grande',
            age: 3,
            size: 'LARGE',
            stamine: 'HIGH',
            independence: 'MEDIUM',
            habitat: 'FREE',
            imgs_url: ['image.jpg', 'image2.jpg'],
            requireds: ['ossos', 'casa'],
            orgId: org?.id
        });

        const response = await request(app.server).get('/pets/list')
            .query({
                city: 'São Paulo',
                independence: 'MEDIUM'
            })
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.pets).toHaveLength(2);
    });
});