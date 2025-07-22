import type { HttpHandler } from "msw";
import { http, HttpResponse } from "msw";
import { mockPrototypes, mockComments, mockAboutData } from "./data";

export const handlers: HttpHandler[] = [
    // --- Auth Handlers ---
    http.get(`/api/user`, () => {
        return new HttpResponse(null, { status: 401 });
    }),
    http.post(`/api/logout`, () => {
        return new HttpResponse(null, { status: 200 });
    }),

    // --- Prototype Handlers ---
    http.get(`/api/prototypes`, () => {
        return HttpResponse.json(mockPrototypes);
    }),
    http.post(`/api/prototypes`, async ({ request }: { request: Request }) => {
        const newPrototype = await request.json();
        newPrototype.id = Math.floor(Math.random() * 1000);
        return HttpResponse.json(newPrototype, { status: 201 });
    }),
    http.put(
        `/api/prototypes/:id`,
        async ({ request }: { request: Request }) => {
            const updatedPrototype = await request.json();
            return HttpResponse.json(updatedPrototype, { status: 200 });
        }
    ),
    http.delete(`/api/prototypes/:id`, () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // --- Comment Handlers ---
    http.get(`/api/prototypes/:prototypeId/comments`, () => {
        return HttpResponse.json(mockComments);
    }),
    http.post(`/api/prototypes/:prototypeId/comments`, () => {
        return new HttpResponse(null, { status: 201 });
    }),
    http.put(
        `/api/comments/:commentId`,
        async ({ request }: { request: Request }) => {
            const body: { content: string } = await request.json();
            return HttpResponse.json({
                ...mockComments[0],
                content: body.content,
            });
        }
    ),
    http.delete(`/api/comments/:commentId`, () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // --- About Page Handler (already relative) ---
    http.get("/about.json", () => {
        return HttpResponse.json(mockAboutData);
    }),
];
