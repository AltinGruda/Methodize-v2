
export async function getUserTeams(userId: string | null) {
    try {
        if(userId === null) throw Error('User is not authenticated.')
        const response = await fetch(`http://localhost:5000/team/list/${userId}`)
        const teams = await response.json();
        return teams;
    } catch (error) {
        console.log(error);
    }
}

export async function addMember(userId: string | null, teamId: string) {
    try {
        if(userId === null) throw Error('User id is null');
        const response = await fetch(`http://localhost:5000/team/${teamId}/user/${userId}`);
        const team = await response.json();

        return team;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch('http://localhost:5000/auth/users');
        const users = await response.json();
        // const names = users.map((data: {name: string}) => data.name)

        // return names;
        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const response = await fetch(`http://localhost:5000/auth/user/${userId}`);
        const user = await response.json();

        return user;
    } catch (error) {
        console.log(error);
    }
}

