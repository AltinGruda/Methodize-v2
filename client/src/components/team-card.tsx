import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Avatar from "boring-avatars";
import { ButtonUnderlined } from "./button-underlined";
import { TeamInterface } from "@/pages/teams";
import { useNavigate } from "react-router-dom";

interface TeamProps {
    team: TeamInterface;
}

export function Team({team} :TeamProps) {
    const navigate = useNavigate();

    return (
        <div>
            <Card className="m-10 flex flex-col justify-center items-center bg-[#EDEDED] hover:scale-105 hover:shadow-2xl transition duration-500 w-full gap-y-3">
                <CardHeader className="flex items-center">
                    <Avatar
                        size={40}
                        name={team.name}
                        variant="marble"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                    <CardTitle className="font-bold">{team.name}</CardTitle>
                    <span className="text-[#727D8F] font-semibold">{team.members.length} members</span>
                    <div className="flex items-center gap-x-2">
                        <span className="font-semibold">{team.owner}</span>
                    </div>
                    <div onClick={() => navigate(`/team/${team._id}`)}>
                        <ButtonUnderlined />
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}