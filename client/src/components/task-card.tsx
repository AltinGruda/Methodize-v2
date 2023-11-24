import { Clock, MessageCircle, MoreVertical } from "lucide-react"
import { CardTitle, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "./ui/button"

export function TaskCard() {
    return (
        <div className="p-2 m-2 flex flex-col bg-[#EDEDED] rounded-md items-start space-y-3">
            <div className="flex justify-between items-start w-full">
                <CardTitle className="text-md font-normal">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque dicta, quae, hic deleniti nisi.</CardTitle>
                <div className="flex justify-end">
                    <MoreVertical className="text-[#6D7789]" />
                </div>
            </div>

            <CardContent className="flex items-center justify-start w-full p-0">
                <MessageCircle className="text-gray-400" />
                <span className="text-gray-400">65</span>
                <div className="w-full flex justify-end gap-3 items-center">
                    <Button variant="ghost" className="bg-[#EDEBFE] rounded-full w-fit h-fit gap-2 text-[#5521B5] hover:text-[#5521B5]"><Clock className="w-5 h-5" /> 2 days left</Button>
                    <Avatar>
                        <AvatarFallback>AG</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </div>
    )
}