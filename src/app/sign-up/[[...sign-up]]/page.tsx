import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Join Campus Founders</h1>
        <p className="text-muted-foreground mt-1">Use your .edu email to sign up</p>
      </div>
      <SignUp />
    </div>
  );
}
