import { prisma } from "@/prisma";
import {PublicUser, CreateUser} from "@/types/User";
import {NextResponse} from "next/server";

export const GET = async (request: Request) => {

    try {
        const usersList: PublicUser[] = await prisma.user.findMany({
            select: {
                email: true,
                id: true
            }
        })



        return Response.json(usersList, {status: 200});


    } catch (error){
        return Response.json({error: "Error fetching users"}, {status: 500});
    }

}


export const addUserToDb = async (data: CreateUser) => {


    const user = await prisma.user.create({
        data: {
            email: data.email,
            authOId:data.auth0Id,
        }
    })

    return user;
}
