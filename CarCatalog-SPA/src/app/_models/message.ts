export interface Message {
    id: number;
    senderId: number;
    senderKnownAs: string;
    senderPhotoUrl: string;
    carId: number;
    content: string;
    messageSent: Date;
}
