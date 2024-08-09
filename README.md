# System ERP dla Papier Company
![Logo](/img/logo.png)
## Wprowadzenie
Witaj w repozytorium Systemu ERP dla Papier Company - zainspirowanego przez kultowy serial "The Office". Nasz system jest zaprojektowany, aby wspierać i optymalizować kluczowe procesy biznesowe w firmie zajmującej się dystrybucją papieru, od zarządzania zapasami po finanse i księgowość.

## [Dokumentacja API](https://karoldawidg.github.io/Paper_Company_Documentation/)

## Funkcjonalności
System ERP składa się z sześciu głównych modułów, zaprojektowanych, aby pokryć wszystkie aspekty działalności firmy:

1. **Zarządzanie Sprzedażą i Zamówieniami:** Ułatwia składanie zamówień, fakturację, i śledzenie dostaw.
2. **Zarządzanie Magazynem:** Oferuje kontrolę zapasów i logistykę wewnętrzną.
3. **Finanse i Księgowość:** Zapewnia przetwarzanie transakcji finansowych i raportowanie.
4. **Zarządzanie Zasobami Ludzkimi:** Wspiera procesy rekrutacji, zarządzanie danymi pracowniczymi i szkolenia.
5. **Analiza Danych i Raportowanie:** Oferuje narzędzia do analizy danych i wsparcia decyzji biznesowych.
6. **Bezpieczeństwo i Kontrola Dostępu:** Zarządza uprawnieniami użytkowników i bezpieczeństwem danych.

## Technologie
System jest budowany z wykorzystaniem nowoczesnych technologii:
- **Backend i Frontend:** TypeScript, zapewniający bezpieczeństwo typów i nowoczesne podejście do tworzenia aplikacji.
- **Baza danych:** MySQL, dla niezawodnego przechowywania danych.
- **Serwer aplikacji:** Express.js, lekki i elastyczny framework.
- **Frontend:** Next.js, umożliwiający server-side rendering i optymalizację aplikacji webowych.
- **Konteneryzacja:** Docker Compose, ułatwiający budowanie, uruchamianie i zarządzanie aplikacjami.

## Rozpoczęcie pracy
1. Pobierz repozytorium uzywajac komendy 
   ### `git clone https://github.com/KarolDawidG/Paper_Company.git`
2. Wykonaj ponizsza komende aby przejsc do folderu backend
    ### `cd backend`
3. Zainstaluj wymagane biblioteki
    ### `npm i`
4. Wykonaj ponizsza komenda aby ustawic przykladowa baze danych
    ### `npm run load`
5. Otworz nowy terminal i przejdz do katalogu frontend oraz zainstaluj niezbedne komponenty
    ### `cd frontend && npm i`
6. W celu poprawnego korzystania z aplikacji, musisz pozyskac niezbedne dane typu klucze i hasla do serwisow, ktore nalezy zapisac w pliku .env w folderze /backend oraz /frontend
7. Aby wystartowac aplikacje uruchom ponizsza komende zarowno w folderze /frontend jak i /backend
    ### `npm run dev`
8. W razie problemow, zbadaj komunikaty pokazujace sie w terminalu.

## Ustawianie zmiennych środowiskowych
W celu poprawnego dzialania aplikacji, musisz utworzyc zmienne srodowiskowe, ktore beda zapisane w pliku .env w folderze /backend oraz /frontend.
Ponizej zostaly wylistowane przykladowe dane:

- PASS: Ustaw hasło dla aplikacji na stronie Google dla swojego konta Gmail: sbxuijfitkpldrhdjl.

- USER: To Twój adres email: twoj.email@gmail.com.

- HOST_DB: Ustaw na localhost, jeśli baza danych działa lokalnie. W przeciwnym razie podaj adres hosta bazy danych.

- NAME_DB: Nazwa Twojej bazy danych: erp.

- USER_DB: Nazwa użytkownika bazy danych: twoja_nazwa.

- PASS_DB: Hasło do bazy danych: przykladowe_haslo.

- PORT: Port, na którym będzie działać Twój lokalny serwer: 3001.

- JWT_SECRET: Tajny klucz do JWT (JSON Web Token) używany do zabezpieczania tokenów: przykladowy_sekretny_klucz.

- service: Dostawca usług e-mail: gmail dla poczty Google.

- REACT_APP_SECRET_KEY i REACT_APP_SITE_KEY: To tajne klucze używane w recaptcha. Użyj klucza strony: 6LfeZQcoAA8u7y6OsGl5iQj9ijhyP1MwR02ABHIu i tajnego klucza: 6LfeZQco84jfnjfkzX8djsuOSnx8zWxLmvqqns4J. Klucz witryny musisz użyć po stronie frontend w folderze: \frontend\.env.

- JWT_CONFIRMED_TOKEN: Kolejny token JWT, używany do potwierdzenia e-maila lub innych bezpiecznych procesów: jyhtf9394jfid69hujgdgdgd53y8383iksn89pfifjfhchxmsk8344hy7f8f0fifjfhg.

- UPLOADTHING_SECRET: Tajny klucz do Uploadthing: dd5884jfj0acefa883hdo1050cfee36cygghgd087b6da8ujdy3cbe473ab0004c.

- UPLOADTHING_APP_ID: Identyfikator aplikacji Uploadthing: r6fdwhyfdsjdj.

- NEXT_PUBLIC_REACT_APP_SITE_KEY: Klucz strony do recaptcha używany po stronie frontend: 6LfeZQcoAAorjfkOsGl5iQj6j2NgfsaR02ABHIu.

- NEXT_PUBLIC_BACKEND: Adres backendu: http://localhost:3001.