import { Photo } from './photo';

export interface User {
    id: number;
    userName: string;
    email: string;
    phoneNumber: string;
    age: number;
    lastActive: Date;
    created: Date;
    photoUrl: string;
    photos?: Photo[];
    roles?: string[];
}
