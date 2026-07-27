// import React from 'react'
// import { auth0 } from "@/lib/auth0";


// export default async function GetStarted() {
//   const session = await auth0.getSession();

//   if (!session) {
//     return <p>Not logged in</p>;
//   }

//   if (!session.user.email_verified) {
//     return <p>Please verify your email</p>;
//   }

//   return (
//     <div>
//       Welcome {session.user.email}
//     </div>
//   );
// }

// app/getstarted/page.tsx

import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function GetStarted() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.email_verified) {
    redirect("/verify-email");
  }

  return (
    <div className='text-center text-4xl'>
      <h1>Welcome!</h1>
      <p>Finish setting up your account.</p>
    </div>
  );
}