import { Section } from '../layout/Section';
import s from './FeatureBand.module.css';

export type Feature = { title: string; text: string };

export function FeatureBand({ title, features }: { title: string; features: Feature[] }) {
  return (
    <Section tone="brand">
      <h2 className={s.title}>{title}</h2>
      <div className={s.grid}>
        {features.map((feature) => (
          <div key={feature.title} className={s.item}>
            <div className={s.itemTitle}>{feature.title}</div>
            <p className={s.itemText}>{feature.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
