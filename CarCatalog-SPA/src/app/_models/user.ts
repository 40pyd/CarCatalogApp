import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    age: number;
    lastActive: Date;
    created: Date;
    photoUrl: string;
    photos?: Photo[];

}
