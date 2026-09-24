import Image from 'next/image';
import { useId } from 'react';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { countdownLabel, formatOpeningDate } from '../../lib/opening';
import type { Promotion } from '../../lib/opening';
import s from './NewStorePromo.module.css';

function Sticker({ promotion }: { promotion: Promotion }) {
  if (promotion.phase === 'justOpened') {
    return <span className={s.stickerWord}>{promotion.days === 0 ? 'Otwarte od dziś' : 'Już otwarte!'}</span>;
  }
  if (promotion.days === 1) return <span className={s.stickerWord}>Jutro!</span>;
  return (
    <>
      <span className={s.stickerSmall}>za</span>
      <span className={s.stickerNumber}>{promotion.days}</span>
      <span className={s.stickerSmall}>dni</span>
    </>
  );
}

/**
 * Banner for a shop that is about to open, or opened within the last two weeks. Pages pick the
 * shop with promotedStore() and skip the banner when it returns null, so it disappears on its own.
 */
export function NewStorePromo({
  promotion,
  fallbackImage,
  showAllStores = false,
}: {
  promotion: Promotion;
  /** shown until the new shop has its own photo in Studio */
  fallbackImage: string;
  showAllStores?: boolean;
}) {
  const titleId = useId();
  const { store, phase, days } = promotion;
  const date = formatOpeningDate(store.openingDate!);
  const upcoming = phase === 'upcoming';
  // the offer is about opening day, so it would mislead afterwards
  const offer = upcoming || days === 0 ? store.openingOffer : '';
  const image = store.image || fallbackImage;

  return (
    <article className={s.card} aria-labelledby={titleId}>
      <div className={s.media}>
        {image ? <Image src={image} alt="" fill sizes="(max-width: 1100px) 100vw, 50vw" /> : null}
        <div className={s.sticker} aria-hidden="true">
          <Sticker promotion={promotion} />
        </div>
      </div>

      <div className={s.body}>
        <div className={s.tags}>
          <Tag tone="solid">{upcoming ? 'Nowy sklep firmowy' : 'Już otwarte'}</Tag>
          <Tag tone="neutral">{upcoming ? `Otwarcie ${date}` : `Od ${date}`}</Tag>
        </div>
        <div className={s.city}>{store.city}</div>
        <h2 id={titleId} className={s.title}>
          {store.street}
        </h2>
        <p className={s.lead}>
          {upcoming
            ? `Otwieramy ${date} — już ${countdownLabel(days)}. To samo pieczywo prosto z naszego pieca, teraz bliżej Ciebie.`
            : 'Nowy sklep firmowy już działa. Zapraszamy — to samo pieczywo prosto z naszego pieca, teraz bliżej Ciebie.'}
        </p>

        {offer ? (
          <p className={s.offer}>
            <span className={s.offerLabel}>Na otwarcie</span>
            {offer}
          </p>
        ) : null}

        {store.hours ? <p className={s.hours}>{store.hours}</p> : null}

        <div className={s.actions}>
          <Button href={store.maps} target="_blank" rel="noreferrer">
            Wyznacz trasę
          </Button>
          {showAllStores ? (
            <Button href="/sklepy" variant="secondary">
              Wszystkie sklepy
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
