import { Photo } from './photo';

export interface User {
    id: number;
    username: string;
    photoUrl: string;
    photos?: Photo[];
}
