'use client';

import { useEffect, useState } from 'react';
import s from './CopyButton.module.css';

type State = 'idle' | 'copied' | 'failed';

/**
 * Copies a value (e.g. the e-mail address) to the clipboard. A mailto: link alone often does
 * nothing on a computer without a configured mail app, so the address can be pasted anywhere.
 * The status is announced from a live region next to the button, not inside it: a live region
 * inside a labelled button is read unreliably.
 */
export function CopyButton({ value, what, label = 'Kopiuj' }: { value: string; what: string; label?: string }) {
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = setTimeout(() => setState('idle'), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      // no clipboard access (old browser, insecure context, denied permission)
      setState('failed');
    }
  }

  const status = state === 'copied' ? 'Skopiowano' : state === 'failed' ? 'Nie udało się skopiować — zaznacz i skopiuj ręcznie' : '';

  return (
    <span className={s.wrap}>
      <button
        type="button"
        className={s.button + (state === 'copied' ? ' ' + s.copied : '')}
        onClick={copy}
        aria-label={`${label} ${what}`}
      >
        {state === 'idle' ? label : null}
        {state === 'copied' ? (
          <>
            Skopiowano <span aria-hidden="true">✓</span>
          </>
        ) : null}
        {state === 'failed' ? 'Zaznacz i skopiuj ręcznie' : null}
      </button>
      <span className={s.srOnly} aria-live="polite">
        {status}
      </span>
    </span>
  );
}
