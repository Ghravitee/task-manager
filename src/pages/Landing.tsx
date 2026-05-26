import { useAuth } from "../context/AuthContext";
import { useNavigation } from "../hooks/useNavigation";
import { Button } from "../components/ui/Button";
import { Zap, Users, LayoutDashboard, ArrowRight } from "lucide-react";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigateTo("/dashboard")}>
                Go to Dashboard
                <ArrowRight size={16} />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigateTo("/login")}>
                  Sign in
                </Button>
                <Button onClick={() => navigateTo("/login")}>
                  Get started free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
          <Zap size={14} />
          Real-time team collaboration
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          Where teams get
          <br />
          <span className="text-cyan-400">things done</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          TaskFlow brings your team together with shared workspaces, real-time
          updates, and powerful task management. Stop juggling tools and start
          shipping.
        </p>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigateTo("/login")}>
            Start for free
            <ArrowRight size={18} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigateTo("/login")}
          >
            Sign in
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-gray-500">
          No credit card required · Free forever for small teams
        </p>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-gray-900/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Everything your team needs
            </h2>
            <p className="mt-3 text-gray-400">
              Built for teams that move fast and ship faster.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="text-cyan-400" size={28} />,
                title: "Team Workspaces",
                desc: "Create workspaces for your team. Invite members, assign roles, and collaborate in one place.",
              },
              {
                icon: <Zap className="text-cyan-400" size={28} />,
                title: "Real-time Updates",
                desc: "See task changes, comments, and status updates the moment they happen — no refresh needed.",
              },
              {
                icon: <LayoutDashboard className="text-cyan-400" size={28} />,
                title: "Project Overview",
                desc: "Organise tasks into projects. Filter by status, priority, and assignee to stay on top of everything.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-gray-900 p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-500/10">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Up and running in minutes
            </h2>
            <p className="mt-3 text-gray-400">
              No complicated setup. No lengthy onboarding.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Create account",
                desc: "Sign up free in seconds.",
              },
              {
                step: "02",
                title: "Create workspace",
                desc: "Set up your team workspace.",
              },
              {
                step: "03",
                title: "Invite your team",
                desc: "Add members and assign roles.",
              },
              {
                step: "04",
                title: "Start shipping",
                desc: "Create projects, assign tasks, get things done.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative flex flex-col gap-3">
                {/* Connector line */}
                {index < 3 && (
                  <div className="absolute left-[calc(50%+2rem)] top-5 hidden h-px w-[calc(100%-2rem)] bg-white/10 md:block" />
                )}
                <div className="flex size-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm font-bold text-cyan-400">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-gray-900/50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to get your team organised?
          </h2>
          <p className="mt-4 text-gray-400">
            Join teams already using TaskFlow to ship faster and collaborate
            better.
          </p>
          <Button
            size="lg"
            className="mt-8"
            onClick={() => navigateTo("/login")}
          >
            Get started for free
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">TaskFlow</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TaskFlow. Built with React + Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
