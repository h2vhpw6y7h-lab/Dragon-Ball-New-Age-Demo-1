# Dragon Ball New Age — Saga Saiyan (demo 0.6)

**Graj:** https://h2vhpw6y7h-lab.github.io/Dragon-Ball-New-Age-Demo-1/?v=7

## Zmiany 0.6
- Nowy oryginalny plik `assets/earth-map-4k.svg` – szczegółowa mapa Ziemi 3840×2160, rysowana jako jeden spójny świat zamiast prostych kwadratowych tekstur.
- `assets/earth-battle-4k.svg` – oryginalna scena Earth/Saiyan Saga 3840×2160 wspólna dla obu postaci.
- Pięć nowych transparentnych ilustracji Goku Normal (czarne włosy): idle, dash, punch, guard, KI. Normal nie korzysta z ilustracji Super Saiyan.
- Rozbudowane efekty ataków, szybkości, trafień, odrzutu, KI i liczb DAMAGE, płynniejsze zmiany klatek.
- Wyższa jakość renderowania mapy na iPhonie (Retina 2.75×) i lekkie skalowanie grafiki źródłowej.
- Nowi przeciwnicy roamingowi: żołnierz Red Ribbon, dzik, wojownik pustelnik, strażnik kapsuł; regiony mają własne tabele spotkań.
- Mapa pozostaje interaktywna: ruch dotykiem/D-pad, lokalizacje, EXP i bossowie Saibamen/Nappa/Vegeta.
- Bez resetowania `localStorage` z poprzedniej wersji.

## Testy / ograniczenia
- Wersja fanowska testowa, nie ukończony produkt.
- Atlas przesłany przez użytkownika zawiera **Super Saiyan Goku i Vegetę**, nie Goku Normal: nie podmieniać nim grafiki Goku na poziomie 1.
- Grafika mapy i sceny jest skalowalnym 4K SVG, nie rasterem 4K. Nie oznacza to renderowania 3840 pikseli na fizycznym ekranie iPhone'a.
- Nie wgrano całych 668 binarnych PNG do GitHub Pages; zajęłyby wiele megabajtów. Zoptymalizowaną paczkę SSJ trzymamy osobno do kolejnego etapu importu.
- Obce obrazy kart i postaci pozostają własnością twórców gry źródłowej; używanie publicznego repozytorium z grafikami nie daje licencji.
