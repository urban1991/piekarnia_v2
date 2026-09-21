import { Container } from '../layout/Container';
import s from './PageHeader.module.css';

export function PageHeader({
  eyebrow,
  title,
  lead,
  centered,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  centered?: boolean;
}) {
  return (
    <Container>
      <div className={s.wrap + (centered ? ' ' + s.centered : '')}>
        <div>
          <div className={s.eyebrow}>{eyebrow}</div>
          <h1 className={s.title}>{title}</h1>
          {centered && lead ? <p className={s.lead}>{lead}</p> : null}
        </div>
        {!centered && lead ? <p className={s.lead}>{lead}</p> : null}
      </div>
    </Container>
  );
}
