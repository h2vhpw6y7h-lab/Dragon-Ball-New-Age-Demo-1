# Dragon Ball New Age — etap 2026-11-02: iPhone Offline Core v5

## Cel
Po wykonaniu wcześniejszego Anime Combat 1.0 (13 wariantów SVG, choreografie ataków) usunąć blokadę działania offline w rzeczywistym demie `index.html` + `saiyan.js`. Nie przebudowywać istniejącej walki, mapy ani zapisu.

## Diagnoza sprzed zmiany
- `index.html` wykonywał `serviceWorker.getRegistrations().then(...unregister())`, więc przy każdym otwarciu wyłączał offline.
- Stary `sw.js` pre-cache'ował `game.js`, mimo że `index.html` ładuje `saiyan.js?v=21`.
- Cache nie zawierał stylów, mapy, przeciwników i podstawowych kadrów Ki.
- `manifest.webmanifest` już deklaruje `display:standalone` i `orientation:landscape`.

## Zakres implementacji
- `sw.js`: wersjonowany pre-cache 28 zasobów bazowych: dokument, silnik, 3 CSS, manifest/ikona, arena i mapa, obrazy walki oraz 13 postaci; aktualizacja atomowa.
- Nawigacja: online-first, przy braku sieci lokalny `index.html`.
- Grafiki, skrypty, style: cache-first z obsługą parametrów `?v=`.
- Dodatkowe HD/4K: cache na żądanie, maksymalnie 24 wpisy, bez usuwania zasobów bazowych; dostępność offline zależy od wcześniejszego użycia i limitu pamięci iOS.
- `index.html`: rejestracja SW, weryfikacja wszystkich pozycji pre-cache przez MessageChannel, komunikat `✓ Gra gotowa offline`.
- Nie czyścimy `localStorage`; zachowujemy `dbna-saiyan-saga-v1`.

## Kryteria akceptacji (fizyczny iPhone)
1. Safari, pozycja pozioma, pierwszy start online przez HTTPS; po instalacji widoczny komunikat `✓ Gra gotowa offline`.
2. W Safari wybierz „Udostępnij → Dodaj do ekranu początkowego”. Otwórz grę co najmniej raz online.
3. Włącz tryb samolotowy, zamknij i uruchom ikonę gry. Ekran startowy, mapa, trening, walka z robotem i podstawowe ataki Ki muszą działać bez sieci.
4. Wykonaj walkę, zdobądź XP, kup umiejętność, wróć na mapę; zamknij grę i otwórz ponownie. Postęp musi przetrwać.
5. Wróć online i sprawdź, że nie występuje nieskończony ekran „Uruchamianie gry…”.
6. Sprawdź w Safari orientację landscape, czy przyciski walki są dostępne dotykiem bez poziomego przewijania.

## Testy wykonane automatycznie
- Statyczna kontrola składni `sw.js` i dwóch skryptów inline `index.html`: PASS.
- Symulowany cykl SW `install → activate → message`: PASS.
- Symulowany start offline, skrypt silnika, grafika Vegety: PASS.
- Nieznany zasób offline zwraca HTTP 503, zamiast błędnego HTML: PASS.
- Sprawdzenie istnienia bazowych plików SVG w repozytorium: PASS.
- **Nie wykonano** uruchomienia na fizycznym iPhonie ani testu publikacji Pages po wdrożeniu. Tych testów nie wolno oznaczać jako PASS bez urządzenia.

## Ograniczenia
- Safari/iOS może usuwać pamięć podręczną po długim czasie lub przy braku miejsca.
- Tryb `?cinema=1` zawiera duże grafiki 4K i nie jest częścią gwarantowanego pre-cache.
- To nadal gra PWA w Safari, nie natywna aplikacja .ipa.
- Przed publiczną dystrybucją potrzebna jest weryfikacja praw do znaków i grafik.

## Następny odrębny etap
**Trening + progresja po walce:** powiązać trzy poziomy treningu z istniejącymi pięcioma drzewkami umiejętności; dodać powtarzalne, deterministyczne testy balansu oraz zabezpieczenie przed farmieniem XP bez limitu. Nie przepisywać obecnych animacji.
