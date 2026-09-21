import Link from 'next/link';
import s from './SectionHeading.module.css';

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  onBrand,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: { href: string; label: string };
  onBrand?: boolean;
}) {
  return (
    <div className={action ? s.split : undefined}>
      <div>
        {eyebrow ? (
          <div className={s.eyebrow + (onBrand ? ' ' + s.onBrand : '')}>{eyebrow}</div>
        ) : null}
        <h2 className={s.title}>{title}</h2>
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
