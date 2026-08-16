import { getUser } from "@/lib/session";
import { getUsersFromDb } from "@/lib/users";

export async function GET () {
  const user = await getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usersList = await getUsersFromDb();
    return Response.json(usersList, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Error fetching users" }, { status: 500 });
  }
};
