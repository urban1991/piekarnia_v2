'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button';
import { validateContact } from '../../lib/contactForm';
import type { ContactErrors } from '../../lib/contactForm';
import s from './ContactForm.module.css';

/** Wire onSubmit to a route handler (app/api/kontakt/route.ts) or a form service. */
export function ContactForm({ onSubmit }: { onSubmit?: (data: FormData) => Promise<void> }) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = validateContact({
      name: String(data.get('name') ?? ''),
      contact: String(data.get('contact') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    setErrors(next);
    if (Object.keys(next).length) return;

    await onSubmit?.(data);
    setSent(true);
    form.reset();
  }

  return (
    <form className={s.form} onSubmit={handleSubmit} noValidate>
      <div className={s.pair}>
        <label className={s.label + (errors.name ? ' ' + s.error : '')}>
          Imię
          <input className={s.input} name="name" placeholder="Jan" />
          {errors.name ? <span className={s.errorText}>{errors.name}</span> : null}
        </label>
        <label className={s.label + (errors.contact ? ' ' + s.error : '')}>
          Telefon lub e-mail
          <input className={s.input} name="contact" placeholder="503 000 000" />
          {errors.contact ? <span className={s.errorText}>{errors.contact}</span> : null}
        </label>
      </div>

      <label className={s.label + (errors.message ? ' ' + s.error : '')}>
        Wiadomość
        <textarea
          className={s.input}
          name="message"
          rows={6}
          placeholder="Chciałbym zamówić 20 chlebów na sobotę…"
        />
        {errors.message ? <span className={s.errorText}>{errors.message}</span> : null}
      </label>

      <Button type="submit" block>
        Wyślij wiadomość
      </Button>

      {sent ? <p className={s.sent}>Dziękujemy — odezwiemy się najszybciej, jak to możliwe.</p> : null}

      <p className={s.consent}>
        Wysyłając, akceptujesz naszą <a href="/dokumenty">politykę prywatności</a>.
      </p>
    </form>
  );
}
