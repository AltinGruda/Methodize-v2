require("dotenv").config({ path: "./config/.env" });
const BASE_URL = 'https://api.daily.co/v1';
const API_AUTH = process.env.ROOM_API;
import { Room as RoomInterface } from '../models/Room'

export async function fetchData<RoomInterface>(endpoint: string, method: string, body?: any): Promise<RoomInterface> {
    const url = `${BASE_URL}/${endpoint}`;
    const requestOptions = {
        method: method,
        headers: {
            Authorization: `Bearer ${API_AUTH}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined 
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        throw error;
    }
}