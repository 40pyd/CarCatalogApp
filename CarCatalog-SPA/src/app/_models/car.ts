import { Photo } from './photo';

export interface Car {
    id: number;
    brandName: string;
    modelName: string;
    color: string;
    price: number;
    photoUrl: string;
    userId: number;
    year: number;
    enginePower?: number;
    isNew?: boolean;
    body?: string;
    fuel?: string;
    transmission?: string;
    drive?: string;
    odometr?: number;
    description?: string;
    photos?: Photo[];
}
