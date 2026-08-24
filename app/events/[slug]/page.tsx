import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, CalendarBlank, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import EventCard from "@/components/EventCard";
import { getEventBySlug, getSimilarEvents } from "@/lib/actions/event.actions";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

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
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  return (
    <main id="event" className="relative z-10 min-h-screen bg-[#030708]/80">
      <div className="container mx-auto px-5 py-8 sm:px-10">
        <Link href="/#events" className="mb-10 flex w-fit items-center gap-2 text-sm text-light-200 transition hover:text-blue">
          <ArrowLeft size={18} aria-hidden="true" />
          All events
        </Link>

        <header className="header">
          <p className="font-martian-mono text-xs uppercase tracking-[0.18em] text-blue">{event.mode} event</p>
          <h1>{event.title}</h1>
          <p>{event.overview}</p>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => <span className="pill" key={tag}>{tag}</span>)}
          </div>
        </header>

        <div className="details">
          <div className="content">
            <Image
              src={event.image}
              alt={`${event.title} event venue`}
              width={1280}
              height={720}
              className="banner"
              priority
            />
            <section className="flex-col-gap-2">
              <h2>About this event</h2>
              <p>{event.description}</p>
            </section>
            <section className="agenda">
              <h2>Agenda</h2>
              <ul>
                {event.agenda.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </div>

          <aside className="booking">
            <div className="signup-card">
              <h2>Event details</h2>
              <div className="flex-col-gap-2 text-light-100">
                <p className="flex-row-gap-2"><MapPin size={18} aria-hidden="true" />{event.venue}, {event.location}</p>
                <p className="flex-row-gap-2"><CalendarBlank size={18} aria-hidden="true" />{formattedDate}</p>
                <p className="flex-row-gap-2"><Clock size={18} aria-hidden="true" />{event.time}</p>
                <p>Hosted by {event.organizer}</p>
                <p>For {event.audience}</p>
              </div>
            </div>
          </aside>
        </div>

        {similarEvents.length > 0 && (
          <section className="similar-events" aria-labelledby="similar-events-heading">
            <div className="mb-8">
              <p className="mb-2 font-martian-mono text-[10px] uppercase tracking-[0.18em] text-blue">You may also like</p>
              <h2 id="similar-events-heading">Similar events</h2>
            </div>
            <div className="events">
              {similarEvents.map((similarEvent) => (
                <EventCard key={similarEvent.slug} event={similarEvent} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}