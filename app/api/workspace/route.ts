import { getUser } from "@/lib/session";
import { createWorkspaceInDb, getWorkspacesFromDb } from "@/lib/workspace";

export async function POST(request: Request) {
    const user = await getUser();

    if(!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const workspace = await createWorkspaceInDb(user.sub, data);
        return Response.json(workspace, { status: 201 });
    } catch (error) {
        console.error("Error creating workspace:", error);
        return Response.json({ error: "Error creating workspace" }, { status: 500 });
    }
}


export async function GET() {
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