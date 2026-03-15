import Link from "next/link";

const PILLARS = [
  {
    title: "Career Matching",
    description:
      "Your resume is analyzed to find roles that fit your skills, experience, and salary goals across every recommended city.",
  },
  {
    title: "Lifestyle Fit",
    description:
      "From walkability to weather, nightlife to nearby hobbies, every city is scored against what actually matters to you.",
  },
  {
    title: "Budget Reality",
    description:
      "Real rental listings, a sample monthly budget, and cost-of-living data so you know what life there actually costs.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Upload Your Resume",
    description:
      "Share your work history so our AI can understand your skills, experience level, and salary range.",
  },
  {
    number: "2",
    title: "Answer a Few Questions",
    description:
      "Tell us about your lifestyle preferences, budget, values, and what matters most in a place to live.",
  },
  {
    number: "3",
    title: "Get Your Results",
    description:
      "Within 24 hours, receive comprehensive reports on 3-5 cities where you would genuinely thrive.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-32">
        <h1 className="font-display text-5xl font-semibold leading-tight text-charcoal md:text-7xl">
          Find where you&apos;ll thrive
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70 md:text-xl">
          Upload your resume, answer a few lifestyle questions, and let our AI
          agents research the US cities where you&apos;d actually love to live
          -- complete with job matches, housing options, and real budgets.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-block rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream"
        >
          Get Started
        </Link>
      </section>

      {/* Value Propositions */}
      <section className="bg-charcoal/[0.03] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-charcoal md:text-4xl">
            More than a job board
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-charcoal/60">
            Roost looks at the full picture -- career, lifestyle, and budget --
            so you can make a move with confidence.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-charcoal/10 bg-cream p-8 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold text-terracotta">
                  {pillar.title}
                </h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-center text-3xl font-semibold text-charcoal md:text-4xl">
            How it works
          </h2>
          <div className="mt-14 flex flex-col gap-12">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta font-display text-xl font-semibold text-cream">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-charcoal/70">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-sage px-8 py-4 text-lg font-semibold text-cream shadow-md transition-colors hover:bg-sage/90 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-cream"
            >
              Start Your Search
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal/10 py-8">
        <p className="text-center text-sm text-charcoal/50">
          Roost -- Find where you&apos;ll thrive.
        </p>
      </footer>
    </div>
  );
}
