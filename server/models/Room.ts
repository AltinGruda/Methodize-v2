import { model, Schema } from 'mongoose';

interface RoomConfig {
    max_participants: number;
    nbf: number;
    exp: number;
    start_video_off: boolean;
    enable_recording: 'cloud' | 'local' | 'none'; // Possible values are 'cloud', 'local', or 'none'
}

export interface Room {
    id: string;
    name: string;
    api_created: boolean;
    privacy: 'public' | 'private'; // Possible values are 'public' or 'private'
    url: string;
    created_at: Date; // change if problem
    config: RoomConfig;
}


const roomSchema = new Schema<Room>({
    id: {
        type: String,
        required: true,
        unique: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    api_created: {
        type: Boolean,
        required: true,
    },
    privacy: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    },
    config: {
        max_participants: { type: Number, required: true },
        nbf: { type: Number, required: true },
        exp: { type: Number, required: true },
        start_video_off: { type: Boolean, required: true },
        enable_recording: { type: String, enum: ['cloud', 'local', 'none'], required: true }
    }

})

export default model<Room>("Room", roomSchema)