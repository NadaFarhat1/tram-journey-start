import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthHeading } from "@/components/tram/auth-shell";
import { AuthTransitionLink } from "@/components/tram/auth-transition-link";
import { FloatingField } from "@/components/tram/floating-field";
import { COUNTRIES } from "@/lib/countries";
import {
  acceptInvitation,
  getInvitation,
  type InvitationDetails,
} from "@/lib/invitations.functions";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — TRAM" },
      { name: "description", content: "Join TRAM and get started with your team." },
      { property: "og:title", content: "Create your account — TRAM" },
      { property: "og:description", content: "Join TRAM and get started with your team." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { invite?: string } =>
    typeof search["invite"] === "string" ? { invite: search["invite"] } : {},
  component: SignUpPage,
});

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  role?: string;
};

function SignUpPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("EG");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { invite: inviteId } = Route.useSearch();
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);

  useEffect(() => {
    if (!inviteId) return;
    getInvitation({ data: { id: inviteId } })
      .then((found) => {
        if (!found) return;
        setInvitation(found);
        setEmail(found.email);
        setRole("member");
      })
      .catch(() => undefined);
  }, [inviteId]);

  const dial = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode)?.dial ?? "+20",
    [countryCode],
  );

  function validate(): Errors {
    const next: Errors = {};
    if (!firstName.trim()) next.firstName = "First name is required.";
    if (!lastName.trim()) next.lastName = "Last name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Please enter a valid email address.";
    const digits = phone.replace(/\D/g, "");
    if (!digits) next.phone = "Phone number is required.";
    else if (digits.length < 6 || digits.length > 15)
      next.phone = "Please enter a valid phone number.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
      next.password = "Password must be at least 8 characters and contain letters and numbers.";
    if (!confirm) next.confirm = "Please confirm your password.";
    else if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!role) next.role = "Please select a role.";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const fullPhone = `${dial}${phone.replace(/\D/g, "")}`;

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: fullPhone,
          role,
          ...(invitation
            ? { invitation_id: invitation.id, invited_project: invitation.projectName }
            : {}),
        },
      },
    });

    if (error) {
      setLoading(false);
      setErrors({ email: error.message });
      return;
    }

    if (invitation && signUpData.user) {
      try {
        await acceptInvitation({
          data: { invitationId: invitation.id, userId: signUpData.user.id },
        });
      } catch {
        // Account exists; acceptance can be retried by the leader re-inviting.
      }
    }

    await supabase.auth.signOut();
    setLoading(false);
    toast.success("Account created successfully");
    await navigate({ to: "/" });
  }

  return (
    <AuthShell visualLeft>
      <AuthHeading
        title="Create Your Account"
        subtitle={
          invitation
            ? `Joining ${invitation.projectName} — invited by ${invitation.inviterName}.`
            : "Join TRAM and get started."
        }
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
          />
          <FloatingField
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={invitation !== null}
            error={errors.email}
          />

          <div className="w-full">
            <div
              className="tram-field flex h-14 items-stretch overflow-hidden p-0 focus-within:border-teal focus-within:bg-background focus-within:shadow-[0_0_0_3px_var(--teal-pale)]"
              aria-invalid={errors.phone ? true : undefined}
            >
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger
                  aria-label="Country code"
                  className="h-full w-[88px] shrink-0 justify-between rounded-none border-0 border-r bg-transparent px-3 text-[0.9375rem] text-charcoal shadow-none focus:ring-0"
                >
                  <span>{dial}</span>
                </SelectTrigger>
                <SelectContent className="max-h-64 min-w-[240px]">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex w-full items-center justify-between gap-6">
                        <span>{country.name}</span>
                        <span className="text-warm-gray">{country.dial}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input
                aria-label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3.5 text-[0.9375rem] text-charcoal outline-none placeholder:text-warm-gray"
              />
            </div>
            {errors.phone ? (
              <p className="mt-1.5 text-xs font-medium text-destructive">{errors.phone}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FloatingField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="rounded-md p-2 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              }
            />
            <Popover>
              <PopoverTrigger
                type="button"
                aria-label="Password requirements"
                className="mt-1.5 flex rounded-md p-1 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                <Info className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 text-xs text-charcoal">
                <ul className="space-y-1">
                  <li>Minimum 8 characters.</li>
                  <li>Must contain letters and numbers.</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          <FloatingField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="rounded-md p-2 text-warm-gray transition-colors hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                {showConfirm ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            }
          />
        </div>

        {invitation ? null : (
        <div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger
              aria-label="Role"
              aria-invalid={errors.role ? true : undefined}
              className="tram-field h-14 px-3.5 text-[0.9375rem] data-[placeholder]:text-warm-gray"
            >
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leader">Leader</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          {errors.role ? (
            <p className="mt-1.5 text-xs font-medium text-destructive">{errors.role}</p>
          ) : null}
        </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="tram-btn w-full border border-teal bg-teal-pale text-teal hover:bg-teal hover:text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-warm-gray">
        Already have an account?{" "}
        <AuthTransitionLink
          to="/"
          direction="reverse"
          className="font-medium text-teal underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Log in
        </AuthTransitionLink>
      </p>
    </AuthShell>
  );
}
