import { getUsersFromDb } from "@/lib/users";

export const GET = async (request: Request) => {

    try {
       const usersList = await getUsersFromDb();
        return Response.json(usersList, {status: 200});


    } catch (error){
        return Response.json({error: "Error fetching users"}, {status: 500});
    }

}


