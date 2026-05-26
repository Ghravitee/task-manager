import { useState } from "react";
import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left panel — branding */}
      <div className="hidden flex-1 flex-col justify-between bg-gray-900 p-12 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">TaskFlow</span>
        </div>

        {/* Tagline */}
        <div>
          <blockquote className="text-2xl font-medium text-white">
            "The way to get started is to quit talking and begin doing."
          </blockquote>
          <p className="mt-4 text-gray-400">— Walt Disney</p>
        </div>

        {/* Feature list */}
        <div className="space-y-4">
          {[
            {
              icon: "🏢",
              title: "Team Workspaces",
              desc: "Organise work across teams and projects",
            },
            {
              icon: "⚡",
              title: "Real-time Updates",
              desc: "See changes instantly as your team works",
            },
            {
              icon: "🎯",
              title: "Task Management",
              desc: "Track priorities, deadlines, and progress",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <p className="font-medium text-white">{feature.title}</p>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="text-lg font-bold text-white">TaskFlow</span>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-white/10 bg-gray-900 p-8">
            {mode === "signin" ? (
              <LoginForm onSwitchToRegister={() => setMode("signup")} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode("signin")} />
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
