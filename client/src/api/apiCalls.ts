import { FieldValues } from "react-hook-form";

export async function RegisterUser(data: FieldValues) {
    try {
        const response = await fetch('http://localhost:5000/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullname: data.name,
                email: data.email,
                password: data.password
            })
        });

        if (response.ok) {
            console.log('User created, redirecting soon!');
        }
    } catch (error) {
        console.log(error);
    }
}
export async function LoginUser(data: FieldValues) {
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
        });

        if (response.ok) {
            console.log('User logging in, redirecting soon!');
        }
    } catch (error) {
        console.log(error);
    }
}
