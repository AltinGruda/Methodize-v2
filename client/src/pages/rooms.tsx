import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Room } from '@/models/Room';
import { getAllRooms } from '@/api/apiCalls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Avatar from 'boring-avatars';
import { Button } from '@/components/ui/button';
import IframeWrapper from '@/components/IframeWrapper';


interface RoomResponse {
    data: Room[]
}

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true);
    const [roomJoinable, setRoomJoinable] = useState<string>('');


    useEffect(() => {
        async function getRooms() {
            try {
                const response: RoomResponse = await getAllRooms();
                const publicRooms = response.data.filter(room => room.privacy === 'public');
                setRooms(publicRooms);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getRooms();
    }, []);

    if(roomJoinable){
        return (
            <IframeWrapper joinRoomName={roomJoinable} />
        )
    }
    
    return (
        <>
            <div className='col-span-4'>
                <div className='flex items-center flex-col space-y-5 m-5'>
                    <h2 className='text-2xl font-bold'>A list of all rooms</h2>
                    <div className='relative'>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon width={20}/>
                        </div>
                        <Input type="search" className='block p-4 pl-10 w-96 rounded-3xl' onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className='grid grid-cols-4 gap-5 p-5'>
                    {/* <RoomCard rooms={rooms} loading={loading} search={search} /> */}
                    {loading && !roomJoinable  && <p>Loading rooms...</p>}
                    {!loading && !roomJoinable && rooms.length === 0 && <p>No public rooms available.</p>}
                    {!loading && !roomJoinable && rooms.length > 0 && rooms.filter((room) => search.toLowerCase() === '' ? room : room.name.toLowerCase().includes(search)).map((room: Room) => (
                        <Card key={room.id} className='grid grid-cols-4 drop-shadow-xl'>
                            <CardHeader className='col-span-1 justify-center'>
                                <Avatar
                                    size={40}
                                    name={room.name}
                                    variant="beam"
                                    colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                />
                            </CardHeader>
                            <CardContent className='col-span-3 mt-5 flex justify-between items-center'>
                                <CardTitle>{room.name}</CardTitle>
                                <Button onClick={() => {
                                    setRoomJoinable(room.name);
                                }}>Join</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Rooms;