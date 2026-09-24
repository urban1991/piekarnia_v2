import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { LegalDocument } from '../../../components/sections/LegalDocument';
import type { LegalSection } from '../../../components/sections/LegalDocument';
import { getSiteSettings } from '../../../lib/data';
import { COMPANY, LEGAL_UPDATED } from '../../../lib/company';

export const metadata = {
  alternates: { canonical: '/polityka-prywatnosci' },
  title: 'Polityka prywatności — Piekarnia Bieżyński',
  description: 'Jakie dane przetwarzamy, gdy odwiedzasz naszą stronę lub się z nami kontaktujesz, i jakie masz prawa. Strona nie używa plików cookies.',
};

export default async function PolitykaPrywatnosciPage() {
  const settings = await getSiteSettings();
  const email = <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>;

  const sections: LegalSection[] = [
    {
      id: 'administrator',
      title: 'Kto odpowiada za Twoje dane',
      content: (
        <>
          <p>
            Administratorem Twoich danych osobowych jest {COMPANY.name} z siedzibą w Świdnicy, {COMPANY.street},{' '}
            {COMPANY.postalCode} {COMPANY.city}, wpisana do rejestru przedsiębiorców prowadzonego przez {COMPANY.court}{' '}
            pod numerem KRS {COMPANY.krs}, NIP {COMPANY.nip}, REGON {COMPANY.regon} (dalej: „my”).
          </p>
          <p>
            W sprawach dotyczących danych osobowych napisz na {email}, zadzwoń pod{' '}
            <a href={settings.phoneHref}>{settings.phone}</a> albo wyślij list na adres siedziby.
          </p>
        </>
      ),
    },
    {
      id: 'zakres',
      title: 'Jakie dane przetwarzamy',
      content: (
        <>
          <p>Przetwarzamy tylko to, co jest potrzebne w danej sytuacji:</p>
          <ul>
            <li>
              <strong>gdy przeglądasz stronę</strong> — adres IP, datę i godzinę wizyty, adres odwiedzanej podstrony
              oraz informacje o przeglądarce i systemie (tzw. logi serwera);
            </li>
            <li>
              <strong>gdy się z nami kontaktujesz</strong> — dane, które sam nam podasz: zwykle imię, numer telefonu
              lub adres e-mail i treść wiadomości;
            </li>
            <li>
              <strong>gdy obserwujesz nasze profile w mediach społecznościowych</strong> — dane widoczne na Twoim
              publicznym profilu i treść Twoich komentarzy lub wiadomości.
            </li>
          </ul>
          <p>Nie zbieramy danych do celów reklamowych i nie tworzymy profili odwiedzających.</p>
        </>
      ),
    },
    {
      id: 'strona',
      title: 'Przeglądanie strony',
      content: (
        <>
          <p>
            Strona działa na serwerach Vercel Inc. (USA), który jako dostawca hostingu automatycznie zapisuje logi
            serwera. Wykorzystujemy je wyłącznie do zapewnienia działania i bezpieczeństwa strony oraz do
            wykrywania błędów — nie łączymy ich z innymi danymi i nie próbujemy ustalić, kto odwiedził stronę.
          </p>
          <p>
            Podstawą jest nasz prawnie uzasadniony interes, czyli utrzymanie sprawnej i bezpiecznej strony
            (art. 6 ust. 1 lit. f RODO). Logi są przechowywane krótko, zgodnie z ustawieniami usługi hostingowej, a
            potem usuwane automatycznie.
          </p>
        </>
      ),
    },
    {
      id: 'mapa',
      title: 'Mapa sklepów',
      content: (
        <>
          <p>
            Mapa na stronie głównej i na stronie „Sklepy” korzysta z OpenStreetMap. Gdy mapa się wyświetla, Twoja
            przeglądarka pobiera jej fragmenty z serwerów OpenStreetMap Foundation (Wielka Brytania), które — jak
            każdy serwer — otrzymują przy tym Twój adres IP i informacje o przeglądarce. Mapa nie zapisuje plików
            cookies. OpenStreetMap Foundation przetwarza te dane zgodnie z własną{' '}
            <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noreferrer">
              polityką prywatności
            </a>
            .
          </p>
          <p>
            Pokazujemy mapę, bo chcemy, żeby łatwo było do nas trafić (art. 6 ust. 1 lit. f RODO). Przycisk
            „Wyznacz trasę” to zwykły link do Map Google — Google otrzymuje informacje dopiero wtedy, gdy go
            klikniesz.
          </p>
        </>
      ),
    },
    {
      id: 'kontakt',
      title: 'Kontakt z nami',
      content: (
        <>
          <p>
            Gdy dzwonisz, piszesz e-mail lub wiadomość, przetwarzamy Twoje dane, żeby odpowiedzieć i załatwić
            sprawę — na przykład przyjąć zamówienie na uroczystość albo porozmawiać o współpracy.
          </p>
          <ul>
            <li>
              Jeśli sprawa dotyczy zamówienia lub umowy, podstawą jest jej przygotowanie lub wykonanie (art. 6 ust. 1
              lit. b RODO).
            </li>
            <li>W pozostałych przypadkach — nasz prawnie uzasadniony interes w odpowiedzi na wiadomość (art. 6 ust. 1 lit. f RODO).</li>
          </ul>
          <p>
            Podanie danych jest dobrowolne, ale bez nich nie będziemy mogli odpowiedzieć. Przechowujemy je przez
            czas potrzebny do załatwienia sprawy, a jeśli wiąże się ona z umową — do upływu terminów przedawnienia
            roszczeń i obowiązków wynikających z przepisów podatkowych i rachunkowych.
          </p>
        </>
      ),
    },
    {
      id: 'media-spolecznosciowe',
      title: 'Linki i media społecznościowe',
      content: (
        <>
          <p>
            Na stronie są linki do Facebooka, Instagramu i Map Google. Nie osadzamy na stronie wtyczek tych
            serwisów, więc zanim klikniesz link, nie dostają one informacji o Twojej wizycie. Po przejściu na ich
            stronę obowiązują ich zasady prywatności.
          </p>
          <p>
            Prowadzimy profile na Facebooku i Instagramie. Dane osób, które je obserwują, komentują lub piszą do
            nas wiadomości, przetwarzamy w celu prowadzenia profili i odpowiadania na wiadomości (art. 6 ust. 1 lit.
            f RODO). Za przetwarzanie danych przez sam serwis odpowiada Meta Platforms Ireland Ltd. — zgodnie ze
            swoją polityką prywatności.
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: 'Pliki cookies',
      content: (
        <>
          <p>
            <strong>Strona nie używa plików cookies</strong> ani podobnych technologii i nie zapisuje niczego w
            Twojej przeglądarce. Nie korzystamy z narzędzi statystycznych ani reklamowych, takich jak Google
            Analytics czy piksel Facebooka. Dlatego nie wyświetlamy okienka ze zgodami.
          </p>
          <p>
            Jedynym wyjątkiem jest panel do zarządzania treścią strony, z którego korzystają wyłącznie upoważnieni
            pracownicy. Po zalogowaniu panel zapisuje w przeglądarce dane sesji, bez których logowanie nie
            działa. Takie zapisywanie jest niezbędne do usługi, o którą użytkownik sam prosi, więc nie wymaga zgody
            (art. 399 ustawy — Prawo komunikacji elektronicznej).
          </p>
          <p>Jeśli kiedyś zaczniemy używać narzędzi wymagających zgody, najpierw o nią zapytamy i zaktualizujemy tę politykę.</p>
        </>
      ),
    },
    {
      id: 'odbiorcy',
      title: 'Komu przekazujemy dane',
      content: (
        <>
          <p>Twoje dane mogą trafić wyłącznie do podmiotów, które pomagają nam prowadzić stronę i firmę:</p>
          <ul>
            <li>dostawcy hostingu strony — Vercel Inc.;</li>
            <li>dostawcy poczty elektronicznej i usług informatycznych;</li>
            <li>biuru rachunkowemu, kancelarii prawnej i firmom doradczym — gdy jest to potrzebne w danej sprawie;</li>
            <li>organom publicznym — gdy wymagają tego przepisy.</li>
          </ul>
          <p>Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych.</p>
        </>
      ),
    },
    {
      id: 'poza-eog',
      title: 'Przekazywanie danych poza EOG',
      content: (
        <p>
          Vercel Inc. ma siedzibę w USA, dlatego logi serwera mogą być przetwarzane poza Europejskim Obszarem
          Gospodarczym. Odbywa się to na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień
          ochrony danych (EU-US Data Privacy Framework) lub standardowych klauzul umownych zatwierdzonych przez
          Komisję (art. 46 ust. 2 lit. c RODO). Wielka Brytania, gdzie działają serwery OpenStreetMap, jest objęta
          decyzją Komisji stwierdzającą odpowiedni stopień ochrony.
        </p>
      ),
    },
    {
      id: 'prawa',
      title: 'Twoje prawa',
      content: (
        <>
          <p>Masz prawo:</p>
          <ul>
            <li>uzyskać dostęp do swoich danych i ich kopię,</li>
            <li>sprostować dane, które są nieprawidłowe,</li>
            <li>żądać usunięcia danych lub ograniczenia ich przetwarzania,</li>
            <li>przenieść dane, które nam przekazałeś,</li>
            <li>
              wnieść sprzeciw wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie — z przyczyn
              związanych z Twoją szczególną sytuacją.
            </li>
          </ul>
          <p>
            Żeby skorzystać z tych praw, napisz na {email}. Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony
            Danych Osobowych (ul. Stawki 2, 00-193 Warszawa,{' '}
            <a href="https://uodo.gov.pl" target="_blank" rel="noreferrer">
              uodo.gov.pl
            </a>
            ).
          </p>
          <p>Nie podejmujemy decyzji w sposób zautomatyzowany i nie profilujemy osób odwiedzających stronę.</p>
        </>
      ),
    },
    {
      id: 'zmiany',
      title: 'Zmiany polityki',
      content: (
        <p>
          Aktualna wersja polityki jest zawsze dostępna na tej stronie. Jeśli zmieni się sposób, w jaki
          przetwarzamy dane, zaktualizujemy ją i zmienimy datę poniżej. Zasady korzystania ze strony opisuje{' '}
          <Link href="/nota-prawna">nota prawna</Link>.
        </p>
      ),
    },
  ];

  return (
    <main>
      <Header phone={settings.phone} phoneHref={settings.phoneHref} />
      <LegalDocument
        title="Polityka prywatności"
        lead="Jakie dane przetwarzamy, gdy odwiedzasz stronę albo się z nami kontaktujesz — i jakie masz prawa. Krótko: strona nie używa plików cookies i nikogo nie śledzi."
        updated={LEGAL_UPDATED}
        sections={sections}
      />
    </main>
  );
}
