'use client';

import { useId, useState } from 'react';
import type { Nutrition } from '../../lib/types';
import s from './NutritionDisclosure.module.css';

/** Collapsible nutrition row with an animated open/close (grid-rows transition). */
export function NutritionDisclosure({ nutrition }: { nutrition: Nutrition }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const n = nutrition;

  return (
    <div className={s.wrap + (open ? ' ' + s.open : '')}>
      <button
        type="button"
        className={s.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          Wartość odżywcza 100 g · {n.kcal} kcal
        </span>
        <span className={s.chevron} aria-hidden="true" />
      </button>
      <div id={panelId} className={s.panel} aria-hidden={!open}>
        <div className={s.inner}>
          <dl className={s.list}>
            <div><dt>Tłuszcz</dt><dd>{n.fat}</dd></div>
            <div><dt>Węglowodany</dt><dd>{n.carbs}</dd></div>
            <div><dt>Błonnik</dt><dd>{n.fiber}</dd></div>
            <div><dt>Białko</dt><dd>{n.protein}</dd></div>
            <div><dt>Sól</dt><dd>{n.salt}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}
