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
# 🗄️ Struktura Bazy Danych ERP – Dystrybucja Papieru

System korzysta z relacyjnej bazy danych **MySQL**, silnik **InnoDB**, kodowanie **UTF-8**.

---

## 📘 Tabele i Relacje

### 🔐 accounts
Przechowuje dane kont użytkowników systemu.
- `id` (PK, `varchar(36)`)
- `username` (UNIQUE)
- `email` (UNIQUE)
- `password`
- `role` – np. `admin`, `sales`, `warehouse`
- `img_url`
- `created_at`
- `is_active` – `BOOLEAN`
- `refresh_token`

🔗 **Relacje:**
- 1–1 z `employees` (przez `account_id`)

---

### 👨‍💼 employees
Zawiera dane pracowników.
- `id` (PK, `varchar(36)`)
- `first_name`, `last_name`
- `email`
- `phone_number`
- `department`
- `position`
- `hire_date`
- `account_id` (FK → `accounts.id`)

🔗 **Relacje:**
- Powiązany z `orders.account_id` jako osoba realizująca zamówienie

---

### 🧑‍💼 clients
Dane klientów.
- `id` (PK, `varchar(36)`)
- `first_name`, `second_name`
- `email`
- `company_name`
- `created_at`

🔗 **Relacje:**
- 1–N z `client_addresses`
- 1–N z `orders`

---

### 🏠 client_addresses
Adresy dostawy klienta.
- `id` (PK)
- `client_id` (FK → `clients.id`)
- `miasto`, `ulica`, `nr_budynku`, `nr_mieszkania`, `kod`
- `nazwa_firmy`
- `created_at`

---

### 📦 products
Produkty oferowane przez firmę.
- `id` (PK)
- `name`, `category`, `description`
- `price`, `stock`
- `created_at`

🔗 **Relacje:**
- 1–N z `order_details`
- 1–N z `product_translations`

---

### 🌐 languages
Obsługa wielu języków.
- `id` (PK)
- `code` (UNIQUE) – np. `pl`, `en`, `de`
- `name`

---

### 🈹 product_translations
Tłumaczenia produktów.
- PK: `(product_id, language_id)` (klucz złożony)
- `product_id` (FK → `products.id`)
- `language_id` (FK → `languages.id`)
- `name`, `description` (tłumaczenia)

---

### 📑 orders
Zamówienia składane przez klientów.
- `id` (PK)
- `client_id` (FK → `clients.id`)
- `client_address_id` (FK → `client_addresses.id`)
- `account_id` (FK → `employees.account_id`)
- `status` (`pending`, `shipped`, `delivered`)
- `payment_status` (`unpaid`, `paid`)
- `payment_date`
- `created_at`

---

### 🧾 order_details
Szczegóły zamówień (produkty i ilości).
- `id` (PK)
- `order_id` (FK → `orders.id`)
- `product_id` (FK → `products.id`)
- `quantity`

---

## ⚙️ Uwagi techniczne

- Wszystkie tabele mają:
  - Klucze główne (`PRIMARY KEY`)
  - Ograniczenia `UNIQUE`, `NOT NULL`, wartości domyślne
- Silnik **InnoDB**:
  - Obsługa transakcji
  - Wymuszanie integralności referencyjnej (`FOREIGN KEY`)
- Kodowanie **UTF-8**:
  - Obsługa wielojęzyczności
- Strategia usuwania:
  - `ON DELETE SET NULL` – np. usunięcie pracownika nie usuwa zamówień

---

## 🔄 Przykładowe rozszerzenia w przyszłości
- `invoices` – faktury
- `logs` – logi systemowe i audytowe
- `permissions` – szczegółowe uprawnienia użytkowników



# ✅ ERP: System Zarządzania Dla Dystrybucji Papieru – Lista TODO

## 📦 1. Moduł Sprzedaży
- [x] Wybór klienta i adresu dostawy
- [x] Dodawanie produktów do zamówienia
- [x] Podgląd koszyka i potwierdzanie zamówienia
- [ ] Historia zamówień klienta
- [ ] Rabaty i kupony rabatowe
- [ ] Konfiguracja warunków płatności
- [ ] Przypisanie handlowca do zamówienia
- [ ] Powiadomienia e-mail dla zamówień oczekujących
- [ ] Widok zaległych płatności (z integracją z księgowością)

---

## 🏷 2. Magazyn
- [x] Lista produktów z paginacją i wyszukiwarką
- [ ] Obsługa dokumentów PZ/WZ
- [ ] Alerty przy niskich stanach magazynowych
- [ ] Historia zmian stanów magazynowych
- [ ] Lokalizacja produktów w magazynie (regał, strefa)
- [ ] Import/eksport produktów (CSV/Excel)
- [ ] Kody kreskowe dla produktów (opcjonalnie)

---

## 👥 3. Zasoby Ludzkie (HR)
- [x] Lista wszystkich pracowników
- [x] Wysyłanie wiadomości do pracowników
- [x] Skrzynka odbiorcza (IMAP)
- [ ] Profil pracownika z historią zatrudnienia i certyfikatami
- [ ] Rejestr urlopów i nieobecności
- [ ] Grafik zmian
- [ ] Powiadomienia o kończących się umowach
- [ ] Wewnętrzne zgłoszenia pracownicze (wnioski, awarie)

---

## 🛡 4. Ochrona i Administracja
- [x] Lista użytkowników i aktualizacja ról
- [ ] Historia logowań i aktywności
- [ ] System blokowania kont (ręczny lub automatyczny)
- [ ] Zgłoszenia naruszeń (alerty bezpieczeństwa)
- [ ] Log audytu zmian (kto co zmienił)

---

## 💰 5. Księgowość
- [ ] Generowanie faktur PDF
- [ ] Historia płatności i zaległości
- [ ] Eksport danych do systemów księgowych (np. Symfonia)
- [ ] Raporty sprzedaży wg klientów/miesięcy
- [ ] Obsługa VAT i zwolnień podatkowych
- [ ] Ręczne księgowanie kosztów i przychodów

---

## 📈 6. Analiza
- [ ] Dashboard z KPI (przychody, zamówienia, klienci, top produkty)
- [ ] Wykresy sprzedaży wg działu, czasu, klienta
- [ ] Analiza błędów i skuteczności pracowników
- [ ] Eksport danych do CSV/PDF
- [ ] Integracja z narzędziami BI (np. Google Analytics, BigQuery)

---

## 🌐 Dodatki globalne
- [ ] Powiadomienia Web Push lub e-mail
- [ ] Wsparcie dla wielu języków (Next.js i18n)
- [ ] Backup bazy danych i logów systemowych
- [ ] Tryb demonstracyjny (dla testów/nowych pracowników)
- [ ] Swagger UI – dokumentacja API aktualna i kompletna

