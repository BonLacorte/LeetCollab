import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useGetUsername = () => {
    const { data: session } = useSession();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user?.name) {
            setUsername(session.user.name);
        }
    }, [session]);

    return username;
};
