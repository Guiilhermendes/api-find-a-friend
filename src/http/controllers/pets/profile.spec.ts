import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma.js";

describe('Profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get a profile pet details', async () => {
        const name: string = 'Astolfo';

        await request(app.server).post('/orgs').send({
            email: 'email@example.com',
            password: '123456',
            street: 'Av Paulista',
            city: 'São Paulo',
            phone_number: '11940404040'
        });
        const org = await prisma.org.findFirst();

        await request(app.server).post('/pets').send({
            name,
            about: 'Um cão muit bonzinho',
            age: 1,
            size: 'SMALL',
            stamine: 'LOW',
            independence: 'LOW',
            habitat: 'SPACIOUS',
            imgs_url: ['image.jpg'],
            requireds: ['ossos'],
            orgId: org?.id
        });

        const prismaPet = await prisma.pet.findFirst();
        const response = await request(app.server).get(`/pets/${prismaPet?.id}`).send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.pet).toEqual(expect.objectContaining({ name }))
    });
});