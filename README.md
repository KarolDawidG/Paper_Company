
# 📦 System ERP dla Papier Company

![Logo](/img/logo.png)

## Wprowadzenie
Witaj w repozytorium **Systemu ERP dla Papier Company**, inspirowanego kultowym serialem *The Office*. System został zaprojektowany z myślą o wspieraniu i optymalizacji kluczowych procesów biznesowych w firmach zajmujących się dystrybucją papieru — w tym w szkołach, urzędach czy małych przedsiębiorstwach.

## 🔗 [Dokumentacja API](https://karoldawidg.github.io/Paper_Company_Documentation/)

## ✨ Funkcjonalności

System składa się z sześciu głównych modułów, zaprojektowanych w celu pokrycia wszystkich aspektów działalności:

### 📌 Funkcjonalności biznesowe
1. **Zarządzanie Sprzedażą i Zamówieniami** – składanie zamówień, fakturowanie, śledzenie dostaw.
2. **Zarządzanie Magazynem** – kontrola stanów i logistyka wewnętrzna.
3. **Finanse i Księgowość** – obsługa transakcji i raportowanie finansowe.
4. **Zarządzanie Zasobami Ludzkimi** – rekrutacja, dane pracownicze, szkolenia.
5. **Analiza i Raportowanie** – wsparcie decyzji poprzez wykresy i zestawienia.
6. **Bezpieczeństwo i Kontrola Dostępu** – role, uprawnienia, aktywność.

### 🛠️ Funkcjonalności użytkowe
- Trzy wersje językowe: **polska**, **angielska**, **francuska** (zarówno frontend, jak i backend).
- Tryb nocny i dzienny.
- Zmiana awatara z użyciem UploadThing (chmura).

## 🧱 Technologie
- **Backend / Frontend:** TypeScript
- **Baza danych:** MySQL (InnoDB, UTF-8)
- **Serwer:** Express.js
- **UI:** Next.js (SSR, SSG), React, Material UI
- **Walidacja:** React Hook Form
- **Powiadomienia:** React Toastify
- **Konteneryzacja:** Docker Compose

## 🚀 Rozpoczęcie pracy

```bash
# 1. Klonowanie repozytorium
git clone https://github.com/KarolDawidG/Paper_Company.git

# 2. Przejście do katalogu backend
cd backend

# 3. Instalacja zależności backendu
npm install

# 4. Wczytanie przykładowej bazy danych
npm run load

# 5. W nowym terminalu przejdź do frontend
cd ../frontend && npm install

# 6. Skonfiguruj zmienne środowiskowe w plikach .env (frontend i backend)
# 7. Uruchom aplikację w obu katalogach:
npm run dev
```

## ⚙️ Zmienne środowiskowe

**Przykład pliku `.env` (backend):**
```
PASS=sbxuijfitkpldrhdjl
USER=twoj.email@gmail.com
HOST_DB=localhost
NAME_DB=erp
USER_DB=twoja_nazwa
PASS_DB=przykladowe_haslo
PORT=3001
JWT_SECRET=przykladowy_sekretny_klucz
service=gmail
JWT_CONFIRMED_TOKEN=jyhtf9394jfid69hujgdgdgd53y8383iksn89pfifjfhchxmsk8344hy7f8f0fifjfhg
UPLOADTHING_SECRET=dd5884jfj0acefa883hdo1050cfee36cygghgd087b6da8ujdy3cbe473ab0004c
UPLOADTHING_APP_ID=r6fdwhyfdsjdj
```

**Przykład pliku `.env` (frontend):**
```
NEXT_PUBLIC_REACT_APP_SITE_KEY=6LfeZQcoAAorjfkOsGl5iQj6j2NgfsaR02ABHIu
NEXT_PUBLIC_BACKEND=http://localhost:3001
```

---

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


---

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

---