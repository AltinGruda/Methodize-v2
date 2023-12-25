import { useState } from "react"
import IframeComponent from "../components/IFrameComponent";
import { FieldValues, useForm } from "react-hook-form";
import { createRoom } from "@/api/apiCalls";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Link } from 'react-router-dom'

export default function Room() {
    const [roomName, setRoomName] = useState<FieldValues>();
    const {
        register,
        handleSubmit,
      } = useForm();

        return (
        <>
            {roomName && <IframeComponent joinRoomName={roomName} />}
            <div className="flex justify-center items-center col-span-4">
                <div>
                    {!roomName && (    
                        <Tabs defaultValue="create" className="w-96">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="create">Create a room</TabsTrigger>
                                <TabsTrigger value="join">Join a room</TabsTrigger>
                            </TabsList>
                            <TabsContent value="create">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create a room</CardTitle>
                                        <CardDescription>
                                            Provide the name of the room and click Create
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <form className="space-y-2" onSubmit={handleSubmit((data: FieldValues) => {
                                            setRoomName(data.createRoom);
                                            createRoom(data.createRoom);
                                            console.log(data);
                                        } )}>
                                            <Label htmlFor="create">Create a room</Label>
                                            <Input id="create" type="text" {...register('createRoom')} />
                                            <Button type="submit">Create</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="join">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Join a room</CardTitle>
                                        <CardDescription>
                                            Provide the name of the room you want to join below
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <form className="space-y-2" onSubmit={handleSubmit((data: FieldValues) => setRoomName(data.joinRoomName) )}>
                                            <Label htmlFor="join">Enter room name</Label>
                                            <Input id="join" type="text" {...register('joinRoomName')} />
                                            <Button type='submit'>Join</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <p className="mt-5">Want to look for more rooms? <Link to={'all'}>Click here!</Link></p>
                        </Tabs>
                    )}
                </div>
            </div>  
        </>
    )
}