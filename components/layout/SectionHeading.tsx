import Link from 'next/link';
import s from './SectionHeading.module.css';

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  onBrand,
  as: Heading = 'h2',
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: { href: string; label: string };
  onBrand?: boolean;
  /** h1 when the heading is the page's main title (e.g. /kontakt) */
  as?: 'h1' | 'h2';
}) {
  return (
    <div className={action ? s.split : undefined}>
      <div>
        {eyebrow ? (
          <div className={s.eyebrow + (onBrand ? ' ' + s.onBrand : '')}>{eyebrow}</div>
        ) : null}
        <Heading className={s.title}>{title}</Heading>
        {lead ? <p className={s.lead + (onBrand ? ' ' + s.brandLead : '')}>{lead}</p> : null}
      </div>
      {action ? (
        <Link className={s.action} href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
