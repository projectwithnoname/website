import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
        Highlighter
      </h1>

      <p className="mt-6 max-w-xl text-xl font-medium text-muted-foreground">
        Highlight anything on the web and keep it. Sign in once and the
        extension follows you everywhere.
      </p>

      <Link
        href="/sign-in"
        className="mt-12 text-2xl font-bold underline underline-offset-8"
      >
        Get started
      </Link>
    </>
  );
}
