import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Avatar from "boring-avatars";
import { ButtonUnderlined } from "./button-underlined";
import { TeamLead } from "./team-lead";

export function Team() {
    return (
        <div>
            <Card className="m-10 flex flex-col justify-center items-center bg-[#EDEDED] hover:scale-105 hover:shadow-2xl transition duration-500 w-full gap-y-3">
                <CardHeader className="flex items-center">
                    <Avatar
                        size={40}
                        name="Spotify" // change this to project.title
                        variant="marble"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                    <CardTitle className="font-bold">Spotify</CardTitle>
                    <span className="text-[#727D8F] font-semibold">{Math.ceil(Math.random()*2)} projects</span>
                    <span className="text-[#727D8F] font-semibold">{Math.ceil(Math.random()*2)} members</span>
                    <div className="flex items-center gap-x-2">
                        <TeamLead />
                        <span className="font-semibold">Filan Fisteku</span>
                    </div>
                    <ButtonUnderlined />
                </CardHeader>
            </Card>
        </div>
    )
}