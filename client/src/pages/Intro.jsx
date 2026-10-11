
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChartNoAxesColumnIncreasing,
  Smile,
  MessageCircle,
  Lightbulb,
  MoreHorizontal,
} from "lucide-react";

const insights = [
  {
    title: "Sentiment analysis",
    description: "Identify positive, neutral and negative feedback",
    percentage: 78,
    icon: Smile,
    color: "pink",
  },
  {
    title: "Recurring issue detection",
    description: "Find common customer problems",
    percentage: 62,
    icon: MessageCircle,
    color: "blue",
  },
  {
    title: "Feature request discovery",
    description: "Identify improvement opportunities",
    percentage: 85,
    icon: Lightbulb,
    color: "orange",
  },
];

export default function Intro() {
  return (
    <main className="landing-page relative min-h-screen overflow-hidden bg-white text-slate-950">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-one" />
        <div className="blob blob-two" />
        <div className="blob blob-three" />
        <div className="absolute left-1/2 top-36 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="dot-pattern absolute bottom-10 left-8" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between rounded-3xl border border-white/80 bg-white/85 px-5 py-3 shadow-[0_8px_35px_rgba(112,72,190,0.08)] backdrop-blur-xl sm:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 to-purple-100 text-violet-700 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              <BrainCircuit size={29} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight sm:text-xl">
                Feedback Synthesis
              </span>
              <span className="block text-xs text-slate-500 sm:text-sm">
                AI-Powered Product Intelligence
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-7">
            <Link
              to="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:text-base"
            >
              Register
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-14 px-6 pb-20 pt-16 sm:px-10 md:pt-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="hero-copy">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-100/70 px-4 py-2 text-sm font-semibold tracking-wide text-violet-700">
            <Sparkles size={17} className="animate-sparkle" />
            AI-POWERED FEEDBACK ANALYTICS
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl xl:text-[68px]">
            Turn customer
            <br />
            feedback into
            <br />
            <span className="gradient-text">
              actionable insights
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg sm:leading-9">
            Make sense of customer opinions with AI-powered analysis.
            Discover sentiment, recurring issues, feature requests, and
            feedback trends in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="primary-button group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-4 font-bold text-white shadow-[0_12px_25px_rgba(124,58,237,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Get started
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-violet-300 bg-white/80 px-7 py-4 font-bold text-violet-800 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50"
            >
              Explore features
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <ShieldCheck size={21} />
              </span>
              Secure account access
            </div>

            <span className="hidden h-8 w-px bg-violet-200 sm:block" />

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <ChartNoAxesColumnIncreasing size={21} />
              </span>
              Data-driven insights
            </div>
          </div>
        </div>

        {/* Analytics preview */}
        <div className="dashboard-wrap mx-auto w-full max-w-[610px]">
          <div className="dashboard-card rounded-[30px] border border-white bg-white/90 p-5 shadow-[0_30px_90px_rgba(111,72,180,0.18)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <ChartNoAxesColumnIncreasing
                    size={29}
                    strokeWidth={2.5}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
                    Understand your customers
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 sm:text-base">
                    Turn feedback into meaningful insights
                  </p>
                </div>
              </div>
              <MoreHorizontal className="shrink-0 text-slate-400" />
            </div>

            <div className="mt-5 space-y-4">
              {insights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`insight-card insight-${item.color} rounded-2xl p-4 sm:p-5`}
                    style={{ "--delay": `${index * 180}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`insight-icon icon-${item.color}`}
                      >
                        <Icon size={27} strokeWidth={2.3} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold tracking-tight text-slate-900 sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="progress-bar h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-400"
                              style={{
                                "--progress": `${item.percentage}%`,
                                "--delay": `${index * 180}ms`,
                              }}
                            />
                          </div>
                          <span className="min-w-10 text-right font-extrabold text-violet-700">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-center text-xs text-slate-500 sm:text-sm">
              <ChartNoAxesColumnIncreasing
                size={17}
                className="text-violet-500"
              />
              A smarter way to explore customer feedback
            </div>
          </div>

          <div className="dashboard-caption mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-xs font-medium text-slate-500 shadow-md shadow-violet-100/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI-powered insights, all in one place
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-violet-100/80 bg-gradient-to-b from-white/80 to-violet-50/70 px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
      >
        <div className="mx-auto max-w-6xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
            Make feedback useful
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need to understand your users
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            Transform unstructured customer opinions into clear signals
            that help you identify problems and prioritize improvements.
          </p>

          <div className="mt-10 grid gap-5 text-left md:grid-cols-3">
            {insights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="feature-card rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
                >
                  <span
                    className={`insight-icon icon-${item.color} mb-5`}
                  >
                    <Icon size={24} />
                  </span>

                  <h3 className="text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-500">
                    {item.description}.
                  </p>
                </article>
              );
            })}
          </div>

          <Link
            to="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            Start analyzing feedback
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-violet-100 bg-white px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Feedback Synthesis · AI-Powered Product Intelligence
      </footer>
    </main>
  );
}
