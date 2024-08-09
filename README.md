# System ERP dla Papier Company
![Logo](/img/logo.png)
## Wprowadzenie
Witaj w repozytorium Systemu ERP dla Papier Company - zainspirowanego przez kultowy serial "The Office". Nasz system jest zaprojektowany, aby wspierać i optymalizować kluczowe procesy biznesowe w firmie zajmującej się dystrybucją papieru, od zarządzania zapasami po finanse i księgowość.

## [Dokumentacja API](https://karoldawidg.github.io/Paper_Company_Documentation/)

## Funkcjonalności
System ERP składa się z sześciu głównych modułów, zaprojektowanych, aby pokryć wszystkie aspekty działalności firmy:

### Funkcjonalnosci biznesowe
1. **Zarządzanie Sprzedażą i Zamówieniami:** Ułatwia składanie zamówień, fakturację, i śledzenie dostaw.
2. **Zarządzanie Magazynem:** Oferuje kontrolę zapasów i logistykę wewnętrzną.
3. **Finanse i Księgowość:** Zapewnia przetwarzanie transakcji finansowych i raportowanie.
4. **Zarządzanie Zasobami Ludzkimi:** Wspiera procesy rekrutacji, zarządzanie danymi pracowniczymi i szkolenia.
5. **Analiza Danych i Raportowanie:** Oferuje narzędzia do analizy danych i wsparcia decyzji biznesowych.
6. **Bezpieczeństwo i Kontrola Dostępu:** Zarządza uprawnieniami użytkowników i bezpieczeństwem danych.

### Funkcjonalnosci uzytkowe
1. Trzy wersje jezykowe - Polska, Angielska i Francuska. Dane dlumaczone sa zarowno po stronie bakendu jak i frontendu.
2. Dwa tryby wysiwetoania: Nocny i dzienny.
3. Mozliwosc zmiany awatara, dzieki chmurze UPLOADTHING

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
Ponizej zostaly wylistowane przykladowe dane.
UWAGA: Ponizsze przykladowe dane, to tylko przyklady, jak mniej wiecej realne zmienne powinny wygladac! Musisz skonfigurowac wlasne klucze i hasla!

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


### Schemat bazy danych
## Tabele główne:
## accounts
id (varchar(36), PK)
username (varchar(50), UNIQUE)
password (varchar(255))
email (varchar(100), UNIQUE)
role (varchar(20), DEFAULT 'user')
img_url (varchar(100), DEFAULT 'https://utfs.io/f/0576a965-e83c-47aa-b5b1-31aeac3c55c0-kmjf4x.jpg')
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
is_active (BOOLEAN, DEFAULT false)
refresh_token (TEXT)

## clients
id (varchar(36), PK)
first_name (varchar(50))
second_name (varchar(255))
email (varchar(100), UNIQUE)
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## client_addresses
id (varchar(36), PK)
client_id (varchar(36), FK, references clients(id))
miasto (varchar(100))
ulica (varchar(100))
nr_budynku (varchar(20))
nr_mieszkania (varchar(20), nullable)
kod (varchar(20))
nazwa_firmy (varchar(100), nullable)
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## orders
id (varchar(36), PK)
client_id (varchar(36), FK, references clients(id))
client_address_id (varchar(36), FK, references client_addresses(id))
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## order_details
id (varchar(36), PK)
order_id (varchar(36), FK, references orders(id))
product_id (varchar(36), FK, references products(id))
quantity (int)

## products
id (varchar(36), PK)
name (varchar(255))
category (varchar(50))
description (text, nullable)
price (decimal(10,2))
stock (int, DEFAULT 0)
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## languages
id (varchar(36), PK)
code (varchar(10), UNIQUE)
name (varchar(50))

## product_translations
product_id (varchar(36), PK, FK, references products(id))
language_id (varchar(36), PK, FK, references languages(id))
name (varchar(255))
description (text, nullable)

## Relacje między tabelami:
clients ma relację jeden-do-wielu z client_addresses (każdy klient może mieć wiele adresów).
clients ma relację jeden-do-wielu z orders (każdy klient może mieć wiele zamówień).
orders ma relację jeden-do-wielu z order_details (każde zamówienie może mieć wiele szczegółów zamówienia).
products ma relację jeden-do-wielu z product_translations (każdy produkt może mieć wiele tłumaczeń).
languages ma relację jeden-do-wielu z product_translations (każdy język może być przypisany do wielu tłumaczeń produktów).

## Kluczowe relacje:
- clients (id) ↔ client_addresses (client_id)
- clients (id) ↔ orders (client_id)
- client_addresses (id) ↔ orders (client_address_id)
- orders (id) ↔ order_details (order_id)
- products (id) ↔ product_translations (product_id)
- languages (id) ↔ product_translations (language_id)