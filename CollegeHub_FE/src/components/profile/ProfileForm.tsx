import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateProfile, useUpdateProfile } from "@/hooks/use-profile"
import type { Profile } from "@/hooks/use-profile"
import { UserIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const YEARS = [1, 2, 3, 4] as const
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const

function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

type ProfileFormProps = {
  mode: "create" | "edit"
  initialProfile?: Profile | null
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

function getInitialState(initialProfile?: Profile | null) {
  if (!initialProfile) {
    return {
      branch: "",
      year: 1 as number,
      section: "A",
      rollNumber: "",
      skillsInput: "",
      interestsInput: "",
      resumeLink: "",
      portfolioLink: "",
    }
  }
  return {
    branch: initialProfile.branch,
    year: Number(initialProfile.year) || 1,
    section: initialProfile.section || "A",
    rollNumber: initialProfile.rollNumber,
    skillsInput: initialProfile.skills?.join(", ") ?? "",
    interestsInput: initialProfile.interests?.join(", ") ?? "",
    resumeLink: initialProfile.resumeLink ?? "",
    portfolioLink: initialProfile.portfolioLink ?? "",
  }
}

export function ProfileForm({
  mode,
  initialProfile,
  onSuccess,
  onCancel,
  className,
}: ProfileFormProps) {
  const initialState = getInitialState(initialProfile)
  const [branch, setBranch] = useState(initialState.branch)
  const [year, setYear] = useState<number>(initialState.year)
  const [section, setSection] = useState<string>(initialState.section)
  const [rollNumber, setRollNumber] = useState(initialState.rollNumber)
  const [skillsInput, setSkillsInput] = useState(initialState.skillsInput)
  const [interestsInput, setInterestsInput] = useState(initialState.interestsInput)
  const [resumeLink, setResumeLink] = useState(initialState.resumeLink)
  const [portfolioLink, setPortfolioLink] = useState(initialState.portfolioLink)

  const createMutation = useCreateProfile()
  const updateMutation = useUpdateProfile()

  const isEdit = mode === "edit"
  const mutation = isEdit ? updateMutation : createMutation

  useEffect(() => {
    if (initialProfile) {
      setBranch(initialProfile.branch)
      setYear(Number(initialProfile.year) || 1)
      setSection(initialProfile.section || "A")
      setRollNumber(initialProfile.rollNumber)
      setSkillsInput(initialProfile.skills?.join(", ") ?? "")
      setInterestsInput(initialProfile.interests?.join(", ") ?? "")
      setResumeLink(initialProfile.resumeLink ?? "")
      setPortfolioLink(initialProfile.portfolioLink ?? "")
    }
  }, [initialProfile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.reset()

    const payload = {
      branch,
      year,
      section,
      rollNumber,
      skills: parseCommaList(skillsInput).length ? parseCommaList(skillsInput) : undefined,
      interests: parseCommaList(interestsInput).length ? parseCommaList(interestsInput) : undefined,
      resumeLink: resumeLink.trim() || undefined,
      portfolioLink: portfolioLink.trim() || undefined,
    }

    if (isEdit) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Profile updated successfully")
          onSuccess?.()
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to update profile")
        },
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Profile created successfully")
          onSuccess?.()
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to create profile")
        },
      })
    }
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
            <UserIcon className="size-8 text-primary" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit ? "Edit Profile" : "Create Profile"}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isEdit
                ? "Update your profile information"
                : "Complete your student profile to get started"}
            </p>
          </div>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-base">
              {isEdit ? "Profile Details" : "Profile Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="section">Section</FieldLabel>
                    <Select value={section} onValueChange={setSection}>
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
                {mutation.error && (
                  <FieldError className="text-destructive">
                    {(mutation.error as Error).message}
                  </FieldError>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending
                      ? isEdit
                        ? "Saving..."
                        : "Creating profile..."
                      : isEdit
                        ? "Save Changes"
                        : "Create Profile"}
                  </Button>
                  {isEdit && onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
