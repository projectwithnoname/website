// export interface User {
//   id: string;
//   auth0Id: string;
//   email: string;
//   validated: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface PublicUser {
  id: string;
  email: string;
}

export interface CreateUser {
  email: string;
  auth0Id: string;
}
