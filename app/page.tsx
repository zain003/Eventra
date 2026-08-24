import { ArrowRight, CalendarDots } from "@phosphor-icons/react/dist/ssr";
import EventCard from "@/components/EventCard";
import GradientText from "@/components/GradientText";
import ShinyText from "@/components/ShinyText";
import { getEvents } from "@/lib/actions/event.actions";
import DarkVeil from "@/components/DarkVeil";
import Particles from "@/components/Particles";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="relative z-10 min-h-screen bg-[#08070d]">
      <main id="home" className="relative">
        <section className="hero-section relative flex min-h-[calc(100vh-var(--page-top)-2rem)] w-full flex-col items-center justify-center overflow-hidden px-[clamp(1rem,2.5vw,1.75rem)] text-center">
          <div className="absolute inset-0 z-0">
            <DarkVeil
              hueShift={0}
              noiseIntensity={0}
              scanlineIntensity={0}
              speed={0.5}
              scanlineFrequency={0}
              warpAmount={0}
            />
          </div>
          <div className="relative z-[1] flex max-w-[min(92vw,56rem)] flex-col items-center px-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-[var(--font-martian-mono)] text-[10px] uppercase tracking-[0.16em] sm:mb-8 sm:text-xs">
              <CalendarDots size={15} weight="duotone" aria-hidden="true" />
              <ShinyText
                text="The developer event calendar"
                speed={2}
                color="#94eaff"
                shineColor="#ffffff"
                spread={120}
                direction="left"
              />
            </div>
            <h1 className="hero-title font-extrabold">
              <GradientText
                colors={["#FF9FFC", "#B497CF", "#5227FF", "#94eaff"]}
                animationSpeed={8}
                showBorder={false}
                className="hero-title mx-auto cursor-default font-extrabold backdrop-blur-none drop-shadow-[0_0_40px_rgba(180,120,255,0.28)]"
              >
                Design unfolds
              </GradientText>
            </h1>
            <p className="hero-lede mx-auto mt-6 max-w-2xl font-medium text-[#f0ecf4] sm:mt-8">
              Find the next thing worth showing up for.
            </p>
            <p className="hero-copy mx-auto mt-3 max-w-xl text-[#bdb5c4]">
              Hackathons, meetups, and conferences curated for people building what&apos;s next.
            </p>
            <a
              href="#events"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#94eaff] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#b9f0ff] sm:mt-9 sm:px-6 sm:py-2.5 sm:text-[0.95rem]"
            >
              <span>Explore events</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section id="events" className="content-container relative isolate min-h-[600px] overflow-hidden pb-16 pt-10" aria-labelledby="featured-events">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true">
            <Particles
              particleColors={["#ffffff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>
          <div className="relative z-10">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-[var(--font-martian-mono)] text-[10px] uppercase tracking-[0.18em] text-[#94eaff] sm:text-xs">
                  Editor&apos;s picks
                </p>
                <h2 id="featured-events" className="font-[var(--font-manrope)] text-2xl font-bold text-[#f7f2e8] sm:text-3xl">
                  Featured events
                </h2>
              </div>
              <span className="text-xs text-[#bdb5c4] sm:text-sm">{events.length} events</span>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
