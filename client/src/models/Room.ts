export interface Room {
    id: string;
    name: string;
    api_created: boolean;
    privacy: 'public' | 'private'; // Possible values are 'public' or 'private'
    url: string;
    created_at: Date; // change if problem
}