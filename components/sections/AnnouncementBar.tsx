import Link from 'next/link';
import type { Announcement } from '../../lib/types';
import s from './AnnouncementBar.module.css';

/**
 * Renders one announcement's dot + text, as a link when it has one.
 * `hidden` marks the duplicate copy used for the seamless marquee loop.
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

/**
 * Narrow ticker under the hero showing active announcements (news, promos, hour changes),
 * scheduled from Studio. The track holds two copies of the list so the CSS animation
 * (translateX 0 -> -50%) loops seamlessly; the second copy is aria-hidden.
 */
export function AnnouncementBar({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <aside className={s.bar} aria-label="Aktualności">
      <div className={s.track}>
        <ul className={s.list}>
          {announcements.map((a) => (
            <li key={a.id}>
              <AnnouncementItem announcement={a} />
            </li>
          ))}
        </ul>
        <ul className={s.list} aria-hidden="true">
          {announcements.map((a) => (
            <li key={`dup-${a.id}`}>
              <AnnouncementItem announcement={a} hidden />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
