import { Photo } from './photo';

export interface Car {
    id: number;
    brandName: string;
    modelName: string;
    color: string;
    price: number;
    photoUrl: string;
    userId: number;
    created?: Date;
    manufactured?: Date;
    horsePowers?: number;
    photos?: Photo[];
}
