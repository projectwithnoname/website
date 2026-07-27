import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <main className='text-center text-4xl'>

        <a href="/auth/login?returnTo=/verify-email">
            Login
        </a>
        <br /><br /><br />
            <a href="/auth/logout">
      Logout
    </a>

      <Button>Kurac</Button>
    </main>
  );
};

export default LoginPage;