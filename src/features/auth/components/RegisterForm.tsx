import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../hooks/useNavigation";
import { useToast } from "../../../hooks/useToast";
import { useAuthForm } from "../hooks/useAuthForm";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Mail, Lock, User, Eye, EyeOff, Camera, X } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { signUp } = useAuth();
  const { navigateTo } = useNavigation();
  const { error: toastError, success: toastSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    fields,
    errors,
    isSubmitting,
    setIsSubmitting,
    setField,
    touchField,
    validateAll,
  } = useAuthForm("signup");

  // Revoke object URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous preview before creating a new one
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset the file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await signUp(
        fields.email,
        fields.password,
        fields.fullName,
        avatarFile ?? undefined,
      );
      toastSuccess("Account created! Welcome to TaskFlow.");
      navigateTo("/dashboard");
    } catch (err) {
      toastError(
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">Create an account</h1>
        <p className="mt-1 text-sm text-gray-400">
          Get started with TaskFlow for free
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Sarah Johnson"
          value={fields.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          onBlur={() => touchField("fullName")}
          error={errors.fullName}
          leftIcon={<User size={16} />}
        />
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
          hint="Must be at least 8 characters"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 transition hover:text-gray-300 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* Avatar upload */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Profile photo</span>

          {avatarPreview ? (
            // Preview state
            <div className="flex items-center gap-3">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-left text-sm text-cyan-400 transition hover:text-cyan-300"
                >
                  Change photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="flex items-center gap-1 text-left text-sm text-gray-500 transition hover:text-red-400"
                >
                  <X size={12} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            // Empty state
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:bg-gray-700 hover:text-white"
            >
              <Camera size={15} className="text-gray-400" />
              Upload photo
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} isLoading={isSubmitting} fullWidth>
        Create account
      </Button>

      {/* Switch to login */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-cyan-400 transition hover:text-cyan-300"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
