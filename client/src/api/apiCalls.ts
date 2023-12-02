import { User } from "@/context/AuthContext";

export async function getUserTeams(user: User | null) {
    try {
        if(user === null) throw Error('User is not authenticated.')
        const response = await fetch(`http://localhost:5000/team/list/${user._id}`)
        const teams = await response.json();
        return teams;
    } catch (error) {
        console.log(error);
    }
}