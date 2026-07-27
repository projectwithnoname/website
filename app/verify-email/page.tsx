import Link from "next/link";

const VerifyEmail = () => {
  return (
    <div className='text-center text-4xl'>
        <h1>Please verify your emali</h1>
        <Link href="">open inbox</Link>


        <a href="/auth/login?returnTo=/get-started" className="block"> 
          I've verified my email
        </a>
    </div>
  )
}

export default VerifyEmail