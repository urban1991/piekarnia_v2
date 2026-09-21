import s from './MapEmbed.module.css';

/**
 * Pass src once the bakery confirms the map (Google Maps embed URL with all 4 stores).
 * Without src the component renders the striped placeholder used in the design.
 */
export function MapEmbed({ src, title = 'Mapa sklepów' }: { src?: string; title?: string }) {
  return (
    <div className={s.map}>
      {src ? (
        <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className={s.note}>
          <span>mapa Google · 4 znaczniki</span>
          <i className={s.pin} style={{ left: '30%', top: '36%' }} aria-hidden="true" />
          <i className={s.pin} style={{ left: '62%', top: '56%' }} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
