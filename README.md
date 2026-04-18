
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
PASS=asdasdafkfokfodjl
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

## 🤖 Opis zmian wykonanych przez AI

Poniższa sekcja dokumentuje zmiany wprowadzone iteracyjnie przy wsparciu AI. Opis ma charakter roboczy i edukacyjny: pokazuje **co** zostało zmienione oraz **dlaczego** dana zmiana była potrzebna z perspektywy spójności działania aplikacji.

### Ważna informacja
Ten opis oraz poniżej wymienione poprawki zostały przygotowane przy wsparciu **AI (Codex)**. Zmiany nie są deklaracją gotowości produkcyjnej systemu, tylko uporządkowaniem wybranych obszarów projektu edukacyjnego.

### Iteracja `27.1.x` - Backend: uszczelnienie flow logowania

#### Co zmieniono
- endpoint logowania został rozszerzony tak, aby zwracał także `refreshToken`,
- endpoint odświeżania sesji wymaga teraz `idUser` oraz `refreshToken`,
- dodano backendowe wylogowanie unieważniające zapisany `refreshToken`,
- poprawiono generowanie tokenów, aby flow sesji było bardziej spójne.

#### Dlaczego
- wcześniejszy model odświeżania sesji był zbyt luźny i łatwo prowadził do niespójności między stanem użytkownika a aktywną sesją,
- brak pełnego flow `logout` po stronie backendu powodował, że wylogowanie było głównie lokalne, a nie faktyczne,
- celem tej iteracji było uporządkowanie podstaw bezpieczeństwa wokół `login / refresh / logout`.

### Iteracja `27.2.x` - Frontend: dopasowanie do nowego flow auth

#### Co zmieniono
- frontend zapisuje `refreshToken` po zalogowaniu,
- mechanizm odświeżania sesji wysyła `idUser` i `refreshToken`,
- poprawiono obsługę `401` w interceptorze,
- wylogowanie z UI wywołuje backendowe `/logout`, a nie tylko czyści dane lokalne.

#### Dlaczego
- po zmianach backendowych frontend nadal działał według starego kontraktu,
- prowadziło to do problemów po wygaśnięciu access tokenu,
- celem było zsynchronizowanie obu warstw aplikacji, aby sesja działała przewidywalnie.

### Iteracja `27.3.x` - Backend: wydzielenie endpointu pomocniczego dla ekranów bez uprawnień

#### Co zmieniono
- dodano osobny endpoint `GET /support/:role`,
- wydzielono zapytanie i metodę do pobierania listy kontaktów wsparcia na podstawie roli,
- oddzielono dane pomocnicze dla UI od danych administracyjnych użytkowników.

#### Dlaczego
- wcześniejsze widoki "brak uprawnień" korzystały z endpointów o bardziej administracyjnym charakterze,
- to utrudniało późniejsze zaostrzanie uprawnień i mogło psuć frontend,
- celem tej iteracji było rozdzielenie danych pomocniczych od właściwych danych modułowych.

### Iteracja `27.4.x` - Frontend: przepięcie widoku "brak uprawnień"

#### Co zmieniono
- komponent odpowiedzialny za widok bez dostępu do modułu korzysta teraz z `/support/:role`,
- frontend pobiera listę kontaktów wsparcia z dedykowanego endpointu zamiast z trasy administracyjnej.

#### Dlaczego
- ekran "brak uprawnień" powinien nadal pokazywać użytkownikowi, z kim może się skontaktować,
- lista kontaktów jest danymi pomocniczymi dla interfejsu, a nie częścią panelu administracyjnego,
- zmiana zmniejsza ryzyko przypadkowego zepsucia tego widoku przy kolejnych poprawkach uprawnień.

### Jak czytać komentarze w kodzie
- `27.1.x` odnosi się do backendowego flow logowania,
- `27.2.x` odnosi się do frontendowego flow logowania,
- `27.3.x` odnosi się do backendowego endpointu wsparcia,
- `27.4.x` odnosi się do frontendowego widoku wsparcia.

Komentarze z tą numeracją zostały dodane bezpośrednio w zmienionych plikach, aby łatwiej było prześledzić zakres i powód konkretnych modyfikacji.

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
