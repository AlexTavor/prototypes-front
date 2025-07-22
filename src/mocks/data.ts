import type { Prototype, Comment, User, AboutData } from "../types";

export const mockPrototypes: Prototype[] = [
    {
        id: 1,
        title: "Mocked Prototype 1",
        description: "A cool project about futuristic things.",
        imageUrl:
            "https://via.placeholder.com/400x200.png/0f172a/cbd5e1?text=Prototype+1",
        playUrl: "https://example.com",
        githubUrl: "https://github.com",
    },
    {
        id: 2,
        title: "Mocked Prototype 2",
        description: "Another awesome idea, but for space.",
        imageUrl:
            "https://via.placeholder.com/400x200.png/0f172a/cbd5e1?text=Prototype+2",
        playUrl: "https://example.com",
        githubUrl: "https://github.com",
    },
];

export const mockComments: Comment[] = [
    {
        id: 101,
        content: "This is a great idea!",
        authorName: "Test User",
        authorAvatarUrl:
            "https://via.placeholder.com/40.png/334155/ffffff?text=TU",
        userId: "user-123",
        createdAt: new Date().toISOString(),
    },
    {
        id: 102,
        content: "I have some feedback on the controls.",
        authorName: "Admin User",
        authorAvatarUrl:
            "https://via.placeholder.com/40.png/0891b2/ffffff?text=AU",
        userId: "admin-sub",
        createdAt: new Date().toISOString(),
    },
];

export const mockUser: User = {
    sub: "user-123",
    name: "Test User",
    email: "test@example.com",
    picture: "https://via.placeholder.com/40.png/334155/ffffff?text=TU",
};

export const mockAdmin: User = {
    sub: "admin-sub",
    name: "Admin User",
    email: "admin@example.com",
    picture: "https://via.placeholder.com/40.png/0891b2/ffffff?text=AU",
};

export const mockAboutData: AboutData = {
    title: "About The Developer",
    imageUrl: "https://via.placeholder.com/192.png/1e293b/ffffff?text=Dev",
    imageAlt: "A picture of the developer",
    content: "This is **mocked** content fetched from `about.json`.",
};
