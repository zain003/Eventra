import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { EventDocument } from "@/database";
import BorderGlow from "@/components/BorderGlow";
import { formatEventDate, formatEventTime } from "@/lib/utils";

type EventCardProps = {
  event: Pick<EventDocument, "slug" | "image" | "title" | "location" | "date" | "time">;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="event-card flex flex-col gap-3 border-l border-[#c084fc]/45 pl-3 sm:pl-4" data-event-slug={event.slug}>
        <BorderGlow
          glowColor="40 80 80"
          backgroundColor="#101019"
          borderRadius={12}
          colors={["#c084fc", "#f472b6", "#38bdf8"]}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-[#18131f]">
            <Image
              src={event.image}
              alt={`${event.title} event venue`}
              width={640}
              height={400}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute right-2.5 top-2.5 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 font-[var(--font-martian-mono)] text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur sm:text-[10px]">
              Tickets available
            </span>
          </div>
        </BorderGlow>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 font-[var(--font-martian-mono)] text-[9px] uppercase tracking-[0.16em] text-[#c9a7ff] sm:text-[10px]">
            <span>Featured event</span>
            <span className="h-1 w-1 rounded-full bg-[#f472b6]" aria-hidden="true" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-[#f7f2e8] transition-colors group-hover:text-[#f0c5ff] sm:text-xl">{event.title}</h2>
          <div className="flex flex-row flex-wrap items-center gap-3 text-xs text-[#bdb5c4] sm:text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} weight="duotone" aria-hidden="true" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} weight="duotone" aria-hidden="true" />
              {formatEventTime(event.time)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
