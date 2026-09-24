import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { LegalDocument } from '../../../components/sections/LegalDocument';
import type { LegalSection } from '../../../components/sections/LegalDocument';
import { getSiteSettings } from '../../../lib/data';
import { COMPANY, LEGAL_UPDATED } from '../../../lib/company';

export const metadata = {
  alternates: { canonical: '/nota-prawna' },
  title: 'Nota prawna — Piekarnia Bieżyński',
  description: 'Kto prowadzi stronę Piekarni Bieżyński i na jakich zasadach można z niej korzystać.',
};

export default async function NotaPrawnaPage() {
  const settings = await getSiteSettings();

  const sections: LegalSection[] = [
    {
      id: 'wlasciciel',
      title: 'Kto prowadzi stronę',
      content: (
        <>
          <p>Stronę prowadzi:</p>
          <dl>
            <dt>Firma</dt>
            <dd>{COMPANY.name}</dd>
            <dt>Adres</dt>
            <dd>
              {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city}
            </dd>
            <dt>Rejestr</dt>
            <dd>
              KRS {COMPANY.krs}, {COMPANY.court}
            </dd>
            <dt>NIP / REGON</dt>
            <dd>
              {COMPANY.nip} / {COMPANY.regon}
            </dd>
            <dt>Kontakt</dt>
            <dd>
              <a href={settings.phoneHref}>{settings.phone}</a>
              {settings.email ? (
                <>
                  {', '}
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </>
              ) : null}
            </dd>
          </dl>
          <p>W dalszej części „my” oznacza powyższą spółkę, a „strona” — ten serwis wraz ze wszystkimi podstronami.</p>
        </>
      ),
    },
    {
      id: 'zasady',
      title: 'Zasady korzystania',
      content: (
        <>
          <p>
            Strona ma charakter informacyjny: przedstawia piekarnię, nasze wypieki i sklepy firmowe. Korzystanie z
            niej jest bezpłatne i nie wymaga zakładania konta. Korzystając ze strony, akceptujesz zasady opisane
            w tej nocie oraz w <Link href="/polityka-prywatnosci">polityce prywatności</Link>.
          </p>
          <p>
            Nie wolno używać strony w sposób niezgodny z prawem ani zakłócający jej działanie, w szczególności
            wprowadzać do niej złośliwego oprogramowania ani próbować uzyskać dostępu do części, które nie są
            publicznie udostępnione.
          </p>
        </>
      ),
    },
    {
      id: 'prawa-autorskie',
      title: 'Prawa autorskie i znaki towarowe',
      content: (
        <>
          <p>
            Teksty, zdjęcia, logo, nazwa „Piekarnia Bieżyński” i wygląd strony są chronione prawem autorskim oraz
            prawem własności przemysłowej. Możesz przeglądać stronę i zapisywać jej fragmenty na własny,
            niekomercyjny użytek. Kopiowanie, rozpowszechnianie lub wykorzystywanie treści do celów komercyjnych
            wymaga naszej pisemnej zgody, z wyjątkiem przypadków dozwolonych przez prawo.
          </p>
          <p>
            Część materiałów pochodzi od innych autorów i jest używana na ich licencjach: niektóre zdjęcia
            pochodzą z serwisu Unsplash, a dane mapy sklepów — z projektu OpenStreetMap (© autorzy OpenStreetMap,
            licencja ODbL). Prawa do tych materiałów należą do ich autorów.
          </p>
        </>
      ),
    },
    {
      id: 'informacje',
      title: 'Informacje na stronie',
      content: (
        <>
          <p>
            Dbamy o to, żeby informacje o wypiekach, wartościach odżywczych, godzinach otwarcia i sklepach były
            rzetelne i aktualne. Mają one jednak charakter informacyjny i nie stanowią oferty w rozumieniu
            Kodeksu cywilnego. Dostępność produktów może się różnić w poszczególnych sklepach i dniach.
          </p>
          <p>
            O skład i alergeny zapytaj w sklepie albo zadzwoń: <a href={settings.phoneHref}>{settings.phone}</a>.
          </p>
        </>
      ),
    },
    {
      id: 'odpowiedzialnosc',
      title: 'Odpowiedzialność',
      content: (
        <p>
          Staramy się, żeby strona działała bez przerw i błędów, ale nie możemy tego zagwarantować — mogą zdarzyć
          się przerwy techniczne lub prace konserwacyjne. W granicach dopuszczalnych przez prawo nie odpowiadamy
          za szkody wynikające z czasowej niedostępności strony. Nic w tej nocie nie ogranicza praw, które
          przysługują konsumentom na podstawie bezwzględnie obowiązujących przepisów.
        </p>
      ),
    },
    {
      id: 'wiadomosci',
      title: 'Wiadomości, które do nas wysyłasz',
      content: (
        <>
          <p>
            Dane osobowe z wiadomości przetwarzamy zgodnie z <Link href="/polityka-prywatnosci">polityką prywatności</Link>.
            Treść wiadomości wykorzystujemy, żeby odpowiedzieć i załatwić sprawę.
          </p>
          <p>
            Pomysły i sugestie dotyczące naszych wypieków, przesłane bez zastrzeżenia poufności, możemy
            wykorzystać przy rozwijaniu oferty. Podawaj prawdziwe dane kontaktowe — inaczej nie będziemy mogli
            odpowiedzieć.
          </p>
        </>
      ),
    },
    {
      id: 'linki',
      title: 'Linki do innych stron',
      content: (
        <p>
          Strona zawiera linki do innych serwisów, na przykład Facebooka, Instagramu i Map Google. Umieszczamy je
          dla wygody i nie odpowiadamy za treści ani zasady tych serwisów. Po przejściu na inną stronę obowiązują
          jej regulaminy i polityka prywatności.
        </p>
      ),
    },
    {
      id: 'prawo',
      title: 'Prawo właściwe i zmiany',
      content: (
        <>
          <p>
            Do korzystania ze strony stosuje się prawo polskie. Spory rozstrzygają sądy polskie właściwe zgodnie
            z przepisami, przy czym konsument zachowuje ochronę, jaką zapewniają mu bezwzględnie obowiązujące
            przepisy.
          </p>
          <p>
            Możemy zmieniać tę notę, na przykład gdy zmieni się strona albo przepisy. Aktualna wersja jest zawsze
            dostępna pod tym adresem.
          </p>
        </>
      ),
    },
  ];

  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <LegalDocument
        title="Nota prawna"
        lead="Kto prowadzi stronę i na jakich zasadach możesz z niej korzystać."
        updated={LEGAL_UPDATED}
        sections={sections}
      />
    </main>
  );
}
