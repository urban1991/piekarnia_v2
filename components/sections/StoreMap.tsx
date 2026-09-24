'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { Store } from '../../lib/types';
import s from './StoreMap.module.css';

type Pinned = Store & { location: NonNullable<Store['location']> };

/** Popup built from DOM nodes rather than an HTML string, so Studio text can never inject markup. */
function popupContent(store: Pinned): HTMLElement {
  const root = document.createElement('div');
  root.className = s.popup;
  const add = (tag: string, className: string, text: string) => {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    root.appendChild(el);
    return el;
  };
  add('strong', s.popupCity, store.city);
  add('span', s.popupStreet, store.street);
  if (store.label) add('span', s.popupLabel, store.label);
  const link = add('a', s.popupLink, 'Wyznacz trasę →') as HTMLAnchorElement;
  link.href = store.maps;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return root;
}

/**
 * OpenStreetMap with a pin per shop that has a location in Studio. No API key, no cookies:
 * directions open Google Maps only when a visitor taps "Wyznacz trasę".
 * Leaflet touches `window`, so it is imported in the effect, after hydration.
 */
export function StoreMap({ stores, title = 'Mapa sklepów' }: { stores: Store[]; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinned = stores.filter((store): store is Pinned => store.location !== null);
  // rebuild the map only when the pins themselves change, not on every parent render
  const pinsKey = pinned.map((p) => `${p.id}:${p.location.lat},${p.location.lng}:${p.featured}`).join('|');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !pinned.length) return;
    let map: LeafletMap | undefined;
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled) return;
      // one finger on a phone must scroll the page, not get stuck panning the map
      const touch = window.matchMedia('(pointer: coarse)').matches;
      // whole zoom levels only: fractional zoom scales the tiles and leaves hairline seams between them
      map = L.map(container, { scrollWheelZoom: false, dragging: !touch });
      // the view must exist before markers are added: Leaflet defers adding layers until it does,
      // and the marker elements (which get the aria-labels below) would not exist yet
      const bounds = L.latLngBounds(pinned.map((p) => [p.location.lat, p.location.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15, animate: false });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      for (const store of pinned) {
        const label = `${store.city}, ${store.street}${store.featured ? ' — sklep główny' : ''}`;
        const marker = L.marker([store.location.lat, store.location.lng], {
          icon: L.divIcon({
            className: s.marker + (store.featured ? ' ' + s.featured : ''),
            iconSize: store.featured ? [22, 22] : [16, 16],
          }),
          title: label,
          riseOnHover: true,
          zIndexOffset: store.featured ? 1000 : 0,
        })
          .bindPopup(popupContent(store))
          .addTo(map);
        marker.getElement()?.setAttribute('aria-label', label);
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
    // pinsKey stands in for `pinned`, which is a new array on every render
  }, [pinsKey]);

  if (!pinned.length) return null;

  return <div ref={containerRef} className={s.map} role="region" aria-label={title} />;
}
