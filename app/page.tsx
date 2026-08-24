import { ArrowDown, CalendarDots, Code } from "@phosphor-icons/react/dist/ssr";
import { Event, connectToDatabase } from "@/database";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  const events = await Event.find().sort({ date: 1 }).lean();

  return (
    <div className="relative z-10 min-h-screen bg-[#030708]/80">
      <header>
        <nav aria-label="Primary navigation">
          <a href="#home" className="logo" aria-label="DevEvent home">
            <span className="flex size-8 items-center justify-center rounded-md bg-blue text-black">
              <Code size={20} weight="bold" aria-hidden="true" />
            </span>
            <p>DevEvent</p>
          </a>
          <ul>
            <li><a href="#home" className="text-sm text-light-100 transition hover:text-blue">Home</a></li>
            <li><a href="#events" className="text-sm text-light-100 transition hover:text-blue">Events</a></li>
            <li><a href="/events/create" className="text-sm text-light-100 transition hover:text-blue">Create Event</a></li>
          </ul>
        </nav>
      </header>

      <main id="home" className="relative">
        <section className="flex min-h-[430px] flex-col items-center justify-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 font-martian-mono text-[10px] uppercase tracking-[0.16em] text-blue">
            <CalendarDots size={14} weight="duotone" aria-hidden="true" />
            The developer event calendar
          </div>
          <h1 className="max-w-4xl leading-[0.96]">
            The hub for every dev event you can&apos;t miss
          </h1>
          <p className="subheading max-w-xl">
            Hackathons, meetups, and conferences curated for people building what&apos;s next.
          </p>
          <a id="explore-btn" href="#events" className="mt-8">
            <span>Explore events</span>
            <ArrowDown size={18} weight="bold" aria-hidden="true" />
          </a>
        </section>

        <section id="events" className="pb-12 pt-4" aria-labelledby="featured-events">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-martian-mono text-[10px] uppercase tracking-[0.18em] text-blue">Editor&apos;s picks</p>
              <h3 id="featured-events">Featured events</h3>
            </div>
            <span className="font-martian-mono text-xs text-light-200">{events.length} events</span>
          </div>
          <div className="events">
            {events.map((event) => <EventCard key={event.slug} event={event} />)}
          </div>
        </section>
      </main>
    </div>
  );
}