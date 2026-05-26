import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────

interface FormFields {
  email: string;
  password: string;
  fullName: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;
type TouchedFields = Partial<Record<keyof FormFields, boolean>>;

// ─── Validators ───────────────────────────────────────────────
// Pure functions — no React, easy to test, easy to reuse

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
}

function validateFullName(name: string): string | undefined {
  if (!name) return "Full name is required.";
  if (name.trim().length < 2) {
    return "Full name must be at least 2 characters.";
  }
}

// ─── Validate all fields ──────────────────────────────────────

function validateFields(
  fields: FormFields,
  mode: "signin" | "signup",
): FormErrors {
  const errors: FormErrors = {};

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(fields.password);
  if (passwordError) errors.password = passwordError;

  // Full name only required for signup
  if (mode === "signup") {
    const nameError = validateFullName(fields.fullName);
    if (nameError) errors.fullName = nameError;
  }

  return errors;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useAuthForm(mode: "signin" | "signup") {
  const [fields, setFields] = useState<FormFields>({
    email: "",
    password: "",
    fullName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Update a single field ───────────────────────────────────

  const setField = useCallback(
    (field: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }));

      // Validate the field immediately if it has been touched
      setErrors((prev) => {
        if (!touched[field]) return prev;

        const updated = { ...prev };

        if (field === "email") {
          const error = validateEmail(value);
          if (error) updated.email = error;
          else delete updated.email;
        }

        if (field === "password") {
          const error = validatePassword(value);
          if (error) updated.password = error;
          else delete updated.password;
        }

        if (field === "fullName") {
          const error = validateFullName(value);
          if (error) updated.fullName = error;
          else delete updated.fullName;
        }

        return updated;
      });
    },
    [touched],
  );

  // ─── Mark field as touched on blur ───────────────────────────

  const touchField = useCallback(
    (field: keyof FormFields) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate immediately when user leaves the field
      const error =
        field === "email"
          ? validateEmail(fields[field])
          : field === "password"
            ? validatePassword(fields[field])
            : validateFullName(fields[field]);

      setErrors((prev) => {
        const updated = { ...prev };
        if (error) updated[field] = error;
        else delete updated[field];
        return updated;
      });
    },
    [fields],
  );

  // ─── Validate all fields before submit ───────────────────────

  const validateAll = useCallback((): boolean => {
    const allErrors = validateFields(fields, mode);

    // Mark all fields as touched so errors show
    setTouched({ email: true, password: true, fullName: true });
    setErrors(allErrors);

    return Object.keys(allErrors).length === 0;
  }, [fields, mode]);

  // ─── Reset form ───────────────────────────────────────────────

  const reset = useCallback(() => {
    setFields({ email: "", password: "", fullName: "" });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    fields,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    setField,
    touchField,
    validateAll,
    reset,
  };
}
