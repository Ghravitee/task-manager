import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../hooks/useNavigation";
import { useToast } from "../../../hooks/useToast";
import { useAuthForm } from "../hooks/useAuthForm";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { signIn } = useAuth();
  const { navigateTo } = useNavigation();
  const { error: toastError } = useToast();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const {
    fields,
    errors,
    isSubmitting,
    setIsSubmitting,
    setField,
    touchField,
    validateAll,
  } = useAuthForm("signin");

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await signIn(fields.email, fields.password);
      const redirect = searchParams.get("redirect");
      navigateTo(redirect?.startsWith("/") ? redirect : "/dashboard");
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-400">
          Sign in to continue to TaskFlow
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={() => touchField("email")}
          error={errors.email}
          leftIcon={<Mail size={16} />}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={fields.password}
          onChange={(e) => setField("password", e.target.value)}
          onBlur={() => touchField("password")}
          error={errors.password}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 transition hover:text-gray-300 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} isLoading={isSubmitting} fullWidth>
        Sign in
      </Button>

      {/* Switch to register */}
      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-cyan-400 transition hover:text-cyan-300"
        >
          Create one
        </button>
      </p>
    </div>
  );
}
