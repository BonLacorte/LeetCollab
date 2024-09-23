import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import axios from "axios";
// import CardProblems from "./CardProblems";
// import CardJoinRoom from "./CardJoinRoom";

type Props = {}

const Homepage = async (props: Props) => {
    const session = await getServerSession(authOptions)

    // if session is not present, redirect to sign-in page
    if (!session) {
        redirect("/sign-in")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">LeetCollab</h1>
                <p className="text-xl text-muted-foreground">Collaborate and solve coding challenges together</p>
            </header>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
                {/* <CardJoinRoom /> */}
                {/* <CardProblems/> */}
            {/* </div> */}
        </div>
    );
}

export default Homepage