import Image from "next/image";
import {
  CalendarBlank,
  Clock,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import type { Event } from "@/lib/constants";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <article id="event-card" className="group" data-event-slug={event.slug}>
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-dark-200">
        <Image
          src={event.image}
          alt={`${event.title} event venue`}
          width={640}
          height={400}
          className="poster transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="title text-light-100">{event.title}</h2>
        <div className="datetime text-xs">
          <div>
            <MapPin size={15} weight="duotone" aria-hidden="true" />
            <span>{event.location}</span>
          </div>
          <div>
            <CalendarBlank size={15} weight="duotone" aria-hidden="true" />
            <span>{event.date}</span>
          </div>
          <div>
            <Clock size={15} weight="duotone" aria-hidden="true" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
    </article>
  );
}