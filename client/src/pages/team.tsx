import { Breadcrumb } from "@/components/breadcrumb";
import { UserNav } from "@/components/user-nav";

export function Team() {
    return (
        <div className="m-10 flex flex-col gap-5 col-span-4">
            <div className="flex justify-between items-center">
                <Breadcrumb />
                <UserNav />
            </div>
            <div>
                <h2 className="text-2xl">Team Blue</h2>
            </div>
        </div>
    )
}