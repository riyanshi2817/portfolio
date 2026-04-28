import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLogin, useRegister } from "@/hooks/use-auth"
import { useCreateProfile } from "@/hooks/use-profile"

const ROLES = ["STUDENT", "FACULTY", "ADMIN"] as const
const YEARS = [1, 2, 3, 4] as const
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const

type AuthFormProps = {
  mode: "login" | "signup"
  className?: string
} & Omit<React.ComponentProps<"div">, "children">

function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function AuthForm({ mode, className, ...props }: AuthFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"STUDENT" | "FACULTY" | "ADMIN">("STUDENT")
  const [signupStep, setSignupStep] = useState<"signup" | "profile">("signup")

  // Profile form state (only for STUDENT)
  const [branch, setBranch] = useState("")
  const [year, setYear] = useState<number>(1)
  const [section, setSection] = useState<string>("A")
  const [rollNumber, setRollNumber] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [interestsInput, setInterestsInput] = useState("")
  const [resumeLink, setResumeLink] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const createProfileMutation = useCreateProfile()

  const mutation = mode === "login" ? loginMutation : registerMutation
  const isPending = mutation.isPending
  const error = mutation.error?.message

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.reset()

    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            toast.success("Logged in successfully")
            navigate("/")
          },
          onError: (err) => {
            toast.error(err.message ?? "Invalid credentials")
          },
        }
      )
    } else {
      registerMutation.mutate(
        { email, password, role },
        {
          onSuccess: () => {
            toast.success("Account created successfully")
            if (role === "STUDENT") {
              setSignupStep("profile")
            } else {
              navigate("/")
            }
          },
          onError: (err) => {
            toast.error(err.message ?? "Something went wrong")
          },
        }
      )
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProfileMutation.reset()

    const payload = {
      branch,
      year,
      section,
      rollNumber,
      skills: parseCommaList(skillsInput).length
        ? parseCommaList(skillsInput)
        : undefined,
      interests: parseCommaList(interestsInput).length
        ? parseCommaList(interestsInput)
        : undefined,
      resumeLink: resumeLink.trim() || undefined,
      portfolioLink: portfolioLink.trim() || undefined,
    }

    createProfileMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile created successfully")
        navigate("/")
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to create profile")
      },
    })
  }

  const showProfileStep = mode === "signup" && role === "STUDENT" && signupStep === "profile"

  return (
    <div
      className={cn(
        "grid min-h-screen w-full grid-cols-1 md:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Left section - full bleed image */}
      <div className="relative hidden min-h-screen w-full overflow-hidden bg-muted md:block">
        <img
          src="/image.png"
          alt="Connect & Learn - Knowledge Sharing, Community, Future Ready"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      {/* Form section */}
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md bg-card">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">
              {showProfileStep
                ? "Enter profile details"
                : mode === "login"
                  ? "Login to your account"
                  : "Create an account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {showProfileStep
                ? "Complete your student profile to get started"
                : mode === "login"
                  ? "Enter your email below to login to your account"
                  : "Enter your details below to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showProfileStep ? (
              <form onSubmit={handleProfileSubmit}>
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="branch">Branch</FieldLabel>
                      <Input
                        id="branch"
                        placeholder="e.g. CSE, ECE"
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value.toUpperCase())}
                        className="bg-background"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="year">Year</FieldLabel>
                      <Select
                        value={String(year)}
                        onValueChange={(v) => setYear(Number(v))}
                      >
                        <SelectTrigger id="year" className="bg-background">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {YEARS.map((y) => (
                              <SelectItem key={y} value={String(y)}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="section">Section</FieldLabel>
                      <Select
                        value={section}
                        onValueChange={setSection}
                      >
                        <SelectTrigger id="section" className="bg-background">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {SECTIONS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="rollNumber">Roll Number</FieldLabel>
                      <Input
                        id="rollNumber"
                        placeholder="e.g. 22CS001"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="bg-background"
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="skills">Skills (optional)</FieldLabel>
                    <Input
                      id="skills"
                      placeholder="e.g. React, Node.js (comma-separated)"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      className="bg-background"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="interests">Interests (optional)</FieldLabel>
                    <Input
                      id="interests"
                      placeholder="e.g. AI, Robotics (comma-separated)"
                      value={interestsInput}
                      onChange={(e) => setInterestsInput(e.target.value)}
                      className="bg-background"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="resumeLink">Resume Link (optional)</FieldLabel>
                    <Input
                      id="resumeLink"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      className="bg-background"
                    />
                    <FieldDescription className="text-muted-foreground">
                      Must be a Google Drive link
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="portfolioLink">Portfolio Link (optional)</FieldLabel>
                    <Input
                      id="portfolioLink"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="bg-background"
                    />
                    <FieldDescription className="text-muted-foreground">
                      Must be a Google Drive link
                    </FieldDescription>
                  </Field>
                  {createProfileMutation.error && (
                    <FieldError className="text-destructive">
                      {createProfileMutation.error.message}
                    </FieldError>
                  )}
                  <Field>
                    <Button
                      type="submit"
                      disabled={createProfileMutation.isPending}
                    >
                      {createProfileMutation.isPending
                        ? "Creating profile..."
                        : "Complete profile"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background"
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    {mode === "login" && (
                      <Link
                        to="/forgot-password"
                        className="text-muted-foreground hover:text-foreground ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background"
                  />
                </Field>
                {mode === "signup" && (
                  <Field>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select
                      value={role}
                      onValueChange={(v) =>
                        setRole(v as "STUDENT" | "FACULTY" | "ADMIN")
                      }
                    >
                      <SelectTrigger id="role" className="w-full bg-background">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                {error && (
                  <FieldError className="text-destructive">{error}</FieldError>
                )}
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Please wait..."
                      : mode === "login"
                        ? "Login"
                        : "Sign up"}
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-muted dark:*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <Field>
                  <Button variant="outline" type="button" disabled>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4"
                    >
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                      />
                    </svg>
                    Login with GitHub
                  </Button>
                  <FieldDescription className="text-center">
                    {mode === "login" ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <Link
                          to="/signup"
                          className="text-primary underline underline-offset-4 hover:text-primary/90"
                        >
                          Sign up
                        </Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-primary underline underline-offset-4 hover:text-primary/90"
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
