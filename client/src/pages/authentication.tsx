import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldValues, useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";

export default function Authentication() {
    const {login} = useUser();
    const {register, handleSubmit} = useForm<FieldValues>();

    const handleLogin = async (data: FieldValues) => {
        // Create a temporary object with email and password properties
        const loginData: { email: string; password: string } = {
            email: data.email as string,
            password: data.password as string,
        };

        // Call the login function with the temporary object
        login(loginData);
    };

    return (
        <div className="w-full h-full flex items-center justify-center col-span-5">
            <Tabs defaultValue="create" className="w-96">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Login</TabsTrigger>
                    <TabsTrigger value="join">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login with your credentials.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form className="space-y-2" onSubmit={handleSubmit(handleLogin)}>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="text" {...register('email')}/>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register('password')} />
                                <Button type="submit">Login</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="join">
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Provide the credentials needed to register.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {/* <form className="space-y-2" onSubmit={handleSubmit((data: FieldValues) => RegisterUser(data))}>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" {...register('name')} />
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="text" {...register('email')} />
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register('password')} />
                                <Button type="submit">Register</Button>
                            </form> */}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}