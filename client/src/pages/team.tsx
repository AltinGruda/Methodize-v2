import { Breadcrumb } from "@/components/breadcrumb";
import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";
import { TeamInterface } from "./teams";
import { useParams } from "react-router-dom";

export function Team() {
    const param = useParams();
    console.log(param.id)
    const [team, setTeam] = useState<TeamInterface | null>(null);
   
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Assuming useId returns a valid teamId
            const response = await fetch(`http://localhost:5000/team/${param.id}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch team data');
            }

            const teamData = await response.json();
            setTeam(teamData);
          } catch (error) {
            console.error('Error fetching team data:', error);
          }
        };
      
        fetchData();
    }, [param.id]); // Add teamId as a dependency

    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div>
                {team ? (
                  <h2 className="text-2xl">{team.name}</h2>
                ) : (
                  <p>Loading...</p>
                )}
            </div>
        </div>
    )
}
