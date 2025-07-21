export interface Prototype {
    title: string;
    description: string;
    imageUrl: string;
    playUrl: string;
    githubUrl: string;
    id?: number;
}

export interface AboutData {
    title: string;
    imageUrl: string;
    imageAlt: string;
    content: string;
}

export interface Comment {
    id: number;
    content: string;
    authorName: string;
    authorAvatarUrl: string;
    userId: string;
    createdAt: string;
}

export interface User {
    sub: string;
    name: string;
    email: string;
    picture: string;
}
