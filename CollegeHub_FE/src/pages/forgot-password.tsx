import { Link } from "react-router"

export function ForgotPasswordPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="text-muted-foreground text-sm">Coming soon</p>
      <Link
        to="/login"
        className="text-primary underline underline-offset-4 hover:text-primary/90"
      >
        Back to login
      </Link>
    </div>
  )
}
