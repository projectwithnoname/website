import { getUsersFromDb } from "@/lib/users";

export const GET = async () => {
  try {
    const usersList = await getUsersFromDb();
    return Response.json(usersList, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: `Error fetching users: ${error}` },
      { status: 500 },
    );
  }
};
