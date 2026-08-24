import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import {
  ArrowLeft,
  Buildings,
  CalendarBlank,
  Clock,
  GlobeHemisphereWest,
  MapPin,
  Tag,
  User,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import EventCard from "@/components/EventCard";
import Particles from "@/components/Particles";
import { getEventBySlug, getSimilarEvents } from "@/lib/actions/event.actions";
import { formatEventDate, formatEventTime } from "@/lib/utils";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="theme-card rounded-2xl p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-[#94eaff]">
        {icon}
        <span className="font-[var(--font-martian-mono)] text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="text-base font-medium leading-snug text-[#f7f2e8] sm:text-lg">{value}</p>
    </div>
  );
}

function EventLoading() {
  return <main className="relative z-10 min-h-screen bg-[#030708]/80" />;
}

export default function EventPage({ params }: EventPageProps) {
  return (
    <Suspense fallback={<EventLoading />}>
      <EventDetails params={params} />
    </Suspense>
  );
}

async function EventDetails({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const similarEvents = await getSimilarEvents(event.slug, event.tags);
  const formattedDate = formatEventDate(event.date, "long");
  const formattedTime = formatEventTime(event.time);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#08070d] pb-12 pt-[calc(var(--page-top)+1rem)] text-[#f7f2e8]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <Particles
          particleColors={["#ffffff", "#c084fc", "#94eaff", "#f472b6"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>
      <div className="content-container relative z-10">
        <Link
          href="/#events"
          className="mb-8 flex w-fit items-center gap-2 text-sm text-[#bdb5c4] transition hover:text-[#94eaff]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          All events
        </Link>

        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12">
          <header className="flex max-w-3xl flex-col items-start gap-4">
            <p className="font-[var(--font-martian-mono)] text-xs uppercase tracking-[0.18em] text-[#94eaff]">
              {event.mode} event
            </p>
            <h1 className="event-title-gradient text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{event.title}</h1>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span className="rounded-md bg-[#18131f] px-5 py-2 text-xs text-[#f7f2e8]" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <figure className="event-feature-frame relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#101019] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
            <Image
              src={event.image}
              alt={`${event.title} event venue`}
              width={640}
              height={400}
              className="h-full w-full rounded-xl object-contain"
              sizes="(min-width: 1024px) 52vw, 100vw"
              priority
            />
          </figure>
        </div>

        <section className="mt-10" aria-labelledby="event-details-heading">
          <h2 id="event-details-heading" className="mb-6 text-2xl font-bold">
            Event details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DetailItem
              icon={<CalendarBlank size={18} weight="duotone" aria-hidden="true" />}
              label="Date"
              value={formattedDate}
            />
            <DetailItem
              icon={<Clock size={18} weight="duotone" aria-hidden="true" />}
              label="Time"
              value={formattedTime}
            />
            <DetailItem
              icon={<MapPin size={18} weight="duotone" aria-hidden="true" />}
              label="Location"
              value={event.location}
            />
            <DetailItem
              icon={<Buildings size={18} weight="duotone" aria-hidden="true" />}
              label="Venue"
              value={event.venue}
            />
            <DetailItem
              icon={<GlobeHemisphereWest size={18} weight="duotone" aria-hidden="true" />}
              label="Format"
              value={event.mode}
            />
            <DetailItem
              icon={<User size={18} weight="duotone" aria-hidden="true" />}
              label="Organizer"
              value={event.organizer}
            />
            <DetailItem
              icon={<Users size={18} weight="duotone" aria-hidden="true" />}
              label="Audience"
              value={event.audience}
            />
            <DetailItem
              icon={<Tag size={18} weight="duotone" aria-hidden="true" />}
              label="Tags"
              value={event.tags.join(", ")}
            />
          </div>
        </section>

        <section className="theme-card mt-10 rounded-[10px] p-6 sm:p-8" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="mb-4 text-2xl font-bold">
            Overview
          </h2>
          <p className="text-base leading-relaxed text-[#d9d4df]">{event.overview}</p>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="theme-card rounded-[10px] p-6 sm:p-8" aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-4 text-2xl font-bold">
              About this event
            </h2>
            <p className="text-base leading-relaxed text-[#bdb5c4]">{event.description}</p>
          </section>

          <section className="theme-card rounded-[10px] p-6 sm:p-8" aria-labelledby="agenda-heading">
            <h2 id="agenda-heading" className="mb-6 text-2xl font-bold">
              Agenda
            </h2>
            <ol className="flex flex-col gap-3">
              {event.agenda.map((item, index) => (
                <li className="flex gap-3" key={item}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#18131f] font-[var(--font-martian-mono)] text-xs text-[#94eaff]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-0.5 text-base leading-relaxed text-[#bdb5c4]">{item}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

        {similarEvents.length > 0 && (
          <section className="content-container relative z-10 mt-16 border-t border-white/10 pt-10" aria-labelledby="similar-events-heading">
          <div className="mb-8">
            <p className="mb-2 font-[var(--font-martian-mono)] text-[10px] uppercase tracking-[0.18em] text-[#94eaff]">
              You may also like
            </p>
            <h2 id="similar-events-heading" className="text-2xl font-bold">
              Similar events
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similarEvents.map((similarEvent) => (
              <EventCard key={similarEvent.slug} event={similarEvent} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
