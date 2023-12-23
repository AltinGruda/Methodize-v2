import { User } from "@/context/AuthContext"

export interface Comment {
    _id?: string
    userId: string
    text: string
    taskId?: string
    user?: {
        name: string
    }
}