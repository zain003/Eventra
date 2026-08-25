"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type CardNavLink = { label: string; href: string; ariaLabel?: string };
type CardNavItem = { label: string; bgColor: string; textColor: string; links: CardNavLink[] };

type CardNavProps = {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  initialLoadAnimation?: boolean;
};

const COLLAPSED_HEIGHT = 60;
const DESKTOP_EXPANDED_HEIGHT = 260;

function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export default function CardNav({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  initialLoadAnimation = true,
}: CardNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isExpandedRef = useRef(false);
  const lastScrollY = useRef(0);

  useLayoutEffect(() => {
    if (!navRef.current || isMobileViewport()) return;

    const timeline = gsap.timeline({ paused: true });
    gsap.set(navRef.current, { height: COLLAPSED_HEIGHT, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 24, opacity: 0 });
    timeline.to(navRef.current, { height: DESKTOP_EXPANDED_HEIGHT, duration: 0.4, ease });
    timeline.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );
    timelineRef.current = timeline;

    if (initialLoadAnimation) {
      gsap.fromTo(navRef.current, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5, ease });
    }

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [ease, initialLoadAnimation]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      if (isExpandedRef.current && delta > 0) {
        timelineRef.current?.reverse();
        isExpandedRef.current = false;
        setIsExpanded(false);
      }

      if (isExpandedRef.current || current < 16) {
        setIsHidden(false);
        lastScrollY.current = current;
        return;
      }

      if (delta > 6) setIsHidden(true);
      else if (delta < -6) setIsHidden(false);

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    if (isMobileViewport()) {
      isExpandedRef.current = !isExpandedRef.current;
      setIsExpanded(isExpandedRef.current);
      return;
    }

    const timeline = timelineRef.current;
    if (!timeline || !navRef.current) return;

    if (isExpandedRef.current) {
      timeline.reverse();
      isExpandedRef.current = false;
      setIsExpanded(false);
      return;
    }

    timeline.clear();
    gsap.set(cardsRef.current, { y: 24, opacity: 0 });
    timeline.to(navRef.current, { height: DESKTOP_EXPANDED_HEIGHT, duration: 0.4, ease });
    timeline.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );
    timeline.play(0);
    isExpandedRef.current = true;
    setIsExpanded(true);
  };

  const closeMenu = () => {
    if (isMobileViewport()) {
      isExpandedRef.current = false;
      setIsExpanded(false);
      return;
    }
    timelineRef.current?.reverse();
    isExpandedRef.current = false;
    setIsExpanded(false);
  };

  return (
    <div className={`card-nav-shell ${isHidden ? "is-hidden" : ""} ${className}`}>
      <nav
        ref={navRef}
        className={`navbar-glow relative block overflow-hidden rounded-2xl border border-white/40 bg-white/68 p-0 text-black shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl backdrop-saturate-150 ${isExpanded ? "max-md:h-auto" : ""}`}
        style={{ height: isExpanded ? undefined : COLLAPSED_HEIGHT }}
        aria-label="Primary"
      >
        <div className="relative z-[2] flex h-[60px] shrink-0 items-center justify-between p-2 pl-[1.1rem]">
          <div
            className="order-2 flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] md:order-none"
            onClick={toggleMenu}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <span
              className={`h-0.5 w-[30px] bg-current transition-transform duration-300 ${isExpanded ? "translate-y-[4px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-[30px] bg-current transition-transform duration-300 ${isExpanded ? "-translate-y-[4px] -rotate-45" : ""}`}
            />
          </div>
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
            aria-label="Home"
          >
            <img src={logo} alt={logoAlt} className="h-7 w-7 object-contain" />
            <span className="text-base font-bold tracking-tight">Eventra</span>
          </Link>
          <Link
            href="/events/create"
            className="hidden h-full items-center rounded-[10px] px-4 text-sm font-medium transition-opacity hover:opacity-80 md:inline-flex"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Create event
          </Link>
        </div>

        <div
          ref={menuPanelRef}
          className={`z-[1] flex flex-col items-stretch gap-2 p-2 pb-3 md:absolute md:inset-x-0 md:bottom-0 md:top-[60px] md:flex-row md:items-end md:gap-3 md:pb-2 ${isExpanded ? "flex max-md:max-h-[70vh] max-md:overflow-y-auto" : "hidden md:flex md:invisible md:pointer-events-none"}`}
          aria-hidden={!isExpanded}
        >
          {items.slice(0, 3).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              ref={(element) => {
                if (element) cardsRef.current[index] = element;
              }}
              className="flex shrink-0 flex-col gap-1.5 rounded-[10px] p-3 md:min-h-[60px] md:flex-1 md:gap-2"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="text-sm font-semibold tracking-tight md:text-lg">{item.label}</div>
              <div className="flex flex-col gap-1 md:mt-auto">
                {item.links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    aria-label={link.ariaLabel ?? link.label}
                    onClick={closeMenu}
                    className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
                  >
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
