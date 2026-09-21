import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import s from './CtaBand.module.css';

export function CtaBand({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: { href: string; label: string };
}) {
  return (
    <div className={s.band}>
      <Container>
        <div className={s.inner}>
          <div>
            <div className={s.title}>{title}</div>
            <p className={s.text}>{text}</p>
          </div>
          <Button href={action.href} variant="inverse">
            {action.label}
          </Button>
        </div>
      </Container>
    </div>
  );
}
