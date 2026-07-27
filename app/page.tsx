import Link from "next/link";
export default function Home() {
  return (
    <div className="text-center text-4xl">
      HOME


      <Link className="block" href={"sign-in"}>Get Started</Link>
    </div>
  );
}