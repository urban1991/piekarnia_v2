# Panel menadżera — instrukcja

Panel: **https://<domena>/studio** (logowanie kontem Sanity, zaproszenie przychodzi e-mailem).

## Dodawanie produktu

1. Treść → Produkty → wybierz kategorię (Chleby / Bułki i rogale / Inne wypieki).
2. Kliknij „+" u góry listy. Kategoria jest już ustawiona.
3. Wypełnij: Nazwa, Waga, Opis, Tagi. W zakładce „Zdjęcia" wgraj wycinankę (PNG bez tła) albo fotografię.
   Jeśli dodasz obie, na stronie pokaże się fotografia.
4. Zakładka „Wartości odżywcze": kcal jako liczba, resztę tekstem (np. „1,3 g").
5. Kliknij **Publikuj** (prawy dolny róg). Zmiana pojawia się na stronie w ciągu kilku sekund.

## Ukrywanie produktu

Otwórz produkt → wyłącz „Widoczny na stronie" → Publikuj. Produkt zostaje w panelu, znika ze strony.

## Kolejność

Pole „Kolejność" (mniejsza liczba = wyżej). Lista w panelu jest sortowana tak samo.

## Sklepy

Treść → Sklepy → edytuj godziny, adres, zdjęcie, link do Google Maps → Publikuj.

## Pasek ogłoszeń

Treść → Ogłoszenia → „+". Uzupełnij:

- **Treść** — krótki tekst (do 120 znaków), bo pasek przewija się w pętli pod zdjęciem hero na stronie głównej.
- **Link (opcjonalnie)** — jeśli wpiszesz adres (np. `/chleby` albo pełny `https://…`), całe ogłoszenie na stronie stanie się klikalne.
- **Pokazuj od / Pokazuj do** — zakres dat, w którym ogłoszenie ma być widoczne. Puste „od" znaczy „od zaraz", puste „do" znaczy „bez końca". Można ustawić tylko jedno z nich.
- **Włączone** — wyłącz, żeby ukryć ogłoszenie bez kasowania (np. na potem).
- **Kolejność** — mniejsza liczba = wyżej / wcześniej w pasku.

Kliknij **Publikuj**. Zmiana pojawia się na stronie od razu (webhook czyści cache po publikacji), ale nawet bez
żadnej publikacji strona sama sprawdza daty co godzinę — więc ogłoszenie zaplanowane wcześniej pojawi się
i zniknie o wyznaczonym czasie automatycznie, z opóźnieniem do godziny.

## Ustawienia strony

Telefon, e-mail, adres, linki social, katalog PDF, dokumenty prawne, zdjęcie hero (strona główna),
zdjęcia „O nas” na stronie głównej (2), zdjęcia strony „O nas” (3), galeria Instagram (6+).

## Dobre praktyki

- Zdjęcia: JPG do 2 MB, min. 1200 px szerokości. Wycinanki: PNG z przezroczystym tłem.
- Nie kasuj kategorii ani ustawień strony (panel to blokuje).
- Wersja robocza nie jest widoczna na stronie do czasu kliknięcia „Publikuj".
- Historia zmian: ikona zegara w nagłówku dokumentu; można cofnąć do wcześniejszej wersji.
