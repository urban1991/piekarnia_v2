'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Announcement } from '../../lib/types';
import s from './AnnouncementBar.module.css';

/**
 * Renders one announcement's dot + text, as a link when it has one.
 * `hidden` marks a duplicate copy used for the seamless marquee loop.
 */
function AnnouncementItem({ announcement, hidden }: { announcement: Announcement; hidden?: boolean }) {
  const content = (
    <>
      <span className={s.dot} aria-hidden="true" />
      <span className={s.text}>{announcement.text}</span>
    </>
  );
  if (announcement.link) {
    return (
      <Link href={announcement.link} className={s.item} tabIndex={hidden ? -1 : undefined}>
        {content}
      </Link>
    );
  }
  return <span className={s.item}>{content}</span>;
}

function List({ announcements, hidden }: { announcements: Announcement[]; hidden?: boolean }) {
  return (
    <ul className={s.list} aria-hidden={hidden || undefined}>
      {announcements.map((a) => (
        <li key={a.id}>
          <AnnouncementItem announcement={a} hidden={hidden} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Narrow ticker under the hero showing active announcements (news, promos, hour changes),
 * scheduled from Studio.
 *
 * The track holds two identical halves and the CSS animation translates it by exactly -50%,
 * so the loop repeats seamlessly. A half must be at least as wide as the bar, otherwise the
 * track runs out of content on the right before it wraps; `repeats` is measured after mount
 * and raises the number of list copies per half until that holds.
 */
export function AnnouncementBar({ announcements }: { announcements: Announcement[] }) {
  const barRef = useRef<HTMLElement>(null);
  const halfRef = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(1);

  useEffect(() => {
    const measure = () => {
      const bar = barRef.current;
      const half = halfRef.current;
      if (!bar || !half) return;
      const listWidth = half.getBoundingClientRect().width / repeats;
      if (listWidth <= 0) return;
      const needed = Math.max(1, Math.ceil(bar.getBoundingClientRect().width / listWidth));
      setRepeats((current) => (current === needed ? current : needed));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [repeats, announcements]);

  if (announcements.length === 0) return null;

  const copies = Array.from({ length: repeats });

  return (
    <aside className={s.bar} aria-label="Aktualności" ref={barRef}>
      <div className={s.track}>
        <div className={s.half} ref={halfRef}>
          {copies.map((_, index) => (
            <List key={index} announcements={announcements} hidden={index > 0} />
          ))}
        </div>
        <div className={s.half} aria-hidden="true">
          {copies.map((_, index) => (
            <List key={index} announcements={announcements} hidden />
          ))}
        </div>
      </div>
    </aside>
  );
}
