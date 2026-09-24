import type { ReactNode } from 'react';
import { Section } from '../layout/Section';
import { PageHeader } from './PageHeader';
import s from './LegalDocument.module.css';

export type LegalSection = { id: string; title: string; content: ReactNode };

/** Legal text with a sticky table of contents; section ids double as #anchors (e.g. /polityka-prywatnosci#cookies). */
export function LegalDocument({
  title,
  lead,
  updated,
  sections,
}: {
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow="Dokumenty" title={title} lead={lead} />
      <Section>
        <div className={s.layout}>
          <nav className={s.toc} aria-label="Spis treści">
            <span className={s.tocTitle}>Spis treści</span>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={s.article}>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <h2>
                  {index + 1}. {section.title}
                </h2>
                {section.content}
              </section>
            ))}
            <p className={s.updated}>Ostatnia aktualizacja: {updated}</p>
          </article>
        </div>
      </Section>
    </>
  );
}
