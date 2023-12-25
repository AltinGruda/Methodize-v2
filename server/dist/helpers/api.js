"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchData = void 0;
require("dotenv").config({ path: "./config/.env" });
const BASE_URL = 'https://api.daily.co/v1';
const API_AUTH = process.env.ROOM_API;
function fetchData(endpoint, method, body) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            // Handle errors here
            console.error('Error:', error);
            throw error;
        }
    });
}
exports.fetchData = fetchData;
