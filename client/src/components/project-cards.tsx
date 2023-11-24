import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { MoreVertical } from 'lucide-react'
import Avatar from "boring-avatars";

export function ProjectCards() {
    return (
        <>
            <Card className="bg-[#EDEDED] hover:scale-105 hover:shadow-2xl transition duration-500 p-7 flex flex-col">
                <div className="flex justify-end">
                    <MoreVertical className="text-[#6D7789]" />
                </div>
                <div className="flex flex-col gap-7">
                    <Avatar
                        size={40}
                        name="Project Tsukinome" // change this to project.title
                        variant="marble"
                        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                    <CardTitle>
                        Project Tsukinome
                    </CardTitle>
                    <CardContent className="p-0 text-[#727D8F] flex flex-col gap-12">
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore officia placeat minus dolorum quos modi ab rerum, autem quae iure est corporis error culpa amet reiciendis eligendi quisquam, assumenda nulla.
                        </div>
                        <div>
                            <p className="font-semibold text-xs">PROJECT OWNER</p>
                            <div className="flex justify-between">
                                <span className="text-green-600">Altin Gruda</span>
                                <span>29 Nov 2023</span>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </>
    )
}