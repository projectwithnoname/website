import { addHighlightToDb } from "@/lib/highlights";
import { getUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const highlight = await addHighlightToDb(user.sub, data);
    return Response.json(highlight, { status: 201 });
  } catch (error) {
    console.error("Error creating highlight:", error);
    return Response.json({ error: "Error creating highlight" }, { status: 500 });
  }
}
