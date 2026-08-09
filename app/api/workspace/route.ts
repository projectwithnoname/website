import { getUser } from "@/lib/session";
import { getWorkspacesFromDb } from "@/lib/workspace";

export async function POST(request: Request) {
    
}


export async function GET(request: Request) {
    const user = await getUser();
    
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const workspaces = await getWorkspacesFromDb(user.sub);
        return Response.json(workspaces, { status: 200 });
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return Response.json({ error: "Error fetching workspaces" }, { status: 500 });
    }
}