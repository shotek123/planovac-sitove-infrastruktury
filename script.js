"use strict";
/**
 * Abstraktní třída reprezentující obecné síťové zařízení.
 * Slouží jako společný základ pro Router a Switch.
 * Z této třídy nelze přímo vytvořit objekt (kvůli klíčovému slovu abstract).
 */
class NetworkDevice {
    // Soukromé atributy - dostupné jen uvnitř této třídy
    id;
    name;
    price;
    powerConsumption;
    /**
     * Konstruktor - spustí se automaticky při new Router(...) nebo new Switch(...).
     * Nejdřív zkontroluje hodnoty, pak je uloží do atributů.
     */
    constructor(id, name, price, powerConsumption) {
        // Validace - zabráníme vytvoření objektu s blbými daty
        if (id === "") {
            throw new Error("ID nesmí být prázdné");
        }
        if (name === "") {
            throw new Error("Název nesmí být prázdný");
        }
        if (price < 0) {
            throw new Error("Cena nesmí být záporná");
        }
        if (powerConsumption < 0) {
            throw new Error("Spotřeba nesmí být záporná");
        }
        // Uložení hodnot do atributů
        this.id = id;
        this.name = name;
        this.price = price;
        this.powerConsumption = powerConsumption;
    }
    // === Gettery - umožňují číst soukromé atributy zvenku ===
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
    getPowerConsumption() {
        return this.powerConsumption;
    }
    /**
     * Vrátí textový popis zařízení - hodí se pro výpis v konzoli.
     */
    getInfo() {
        return `${this.name} (ID: ${this.id}, cena: ${this.price} Kč, spotřeba: ${this.powerConsumption} W)`;
    }
}
/**
 * Router - první konkrétní typ síťového zařízení.
 * Dědí všechny společné vlastnosti z NetworkDevice.
 * Navíc si přidává rychlost WAN portu.
 */
class Router extends NetworkDevice {
    wanSpeed;
    constructor(id, name, price, powerConsumption, wanSpeed) {
        super(id, name, price, powerConsumption);
        if (wanSpeed < 0) {
            throw new Error("WAN rychlost nesmí být záporná");
        }
        this.wanSpeed = wanSpeed;
    }
    getWanSpeed() {
        return this.wanSpeed;
    }
    /**
     * Implementace abstraktní metody z rodiče.
     * U routeru je propustnost rovna rychlosti WAN portu.
     */
    calculateThroughput() {
        return this.wanSpeed;
    }
}
/**
 * Switch - druhý konkrétní typ síťového zařízení.
 * Dědí všechny společné vlastnosti z NetworkDevice.
 * Navíc si přidává počet portů a rychlost jednoho portu.
 */
class Switch extends NetworkDevice {
    portCount;
    portSpeed;
    constructor(id, name, price, powerConsumption, portCount, portSpeed) {
        super(id, name, price, powerConsumption);
        if (portCount < 0) {
            throw new Error("Počet portů nesmí být záporný");
        }
        if (portSpeed < 0) {
            throw new Error("Rychlost portu nesmí být záporná");
        }
        this.portCount = portCount;
        this.portSpeed = portSpeed;
    }
    getPortCount() {
        return this.portCount;
    }
    getPortSpeed() {
        return this.portSpeed;
    }
    /**
     * Implementace abstraktní metody z rodiče.
     * U switche se propustnost počítá jako součet rychlostí všech portů.
     */
    calculateThroughput() {
        return this.portCount * this.portSpeed;
    }
}
// =============================================================
// HLAVNÍ LOGIKA - vytvoření instancí z katalogu
// =============================================================
/**
 * Funkce, která z prostých dat v katalogu vytvoří instance tříd.
 * Podle vlastnosti "type" rozhodne, zda vytvoří Router nebo Switch.
 */
function vytvoritZarizeni(data) {
    if (data.type === 'router') {
        return new Router(data.id, data.name, data.price, data.powerConsumption, data.wanSpeed);
    }
    else {
        return new Switch(data.id, data.name, data.price, data.powerConsumption, data.portCount, data.portSpeed);
    }
}
// Vytvoření pole instancí z katalogu (= "oživení" surových dat)
const zarizeni = katalog.map(vytvoritZarizeni);
// Pole zařízení, která uživatel přidal do "Moje síť"
const mojeSit = [];
// =============================================================
// FÁZE 3 - PROPOJENÍ S DOM
// =============================================================
/**
 * Vykreslí katalog zařízení do HTML.
 * Pro každou instanci v poli zarizeni vytvoří kartu
 * a vloží ji do div#catalog-list.
 */
function vykresliKatalog() {
    const container = document.getElementById('catalog-list');
    if (!container)
        return;
    // Vyprázdni existující obsah
    container.innerHTML = '';
    // Pro každé zařízení v poli zarizeni vytvoř kartu
    for (const z of zarizeni) {
        const karta = document.createElement('div');
        karta.className = 'card';
        karta.innerHTML = `
            <div class="card-name">${z.getName()}</div>
            <div class="card-info">Cena: ${z.getPrice()} Kč</div>
            <div class="card-info">Spotřeba: ${z.getPowerConsumption()} W</div>
            <div class="card-info">Propustnost: ${z.calculateThroughput()} Mbps</div>
            <button class="card-button" data-id="${z.getId()}">+ Přidat do sítě</button>
        `;
        container.appendChild(karta);
    }
}
/**
 * Funkce reaguje na klik na tlačítko "+ Přidat" v katalogu.
 * Najde zařízení podle ID a přidá ho do "Moje síť".
 */
function pridejDoSite(id) {
    const zarizeniKPridani = zarizeni.find(z => z.getId() === id);
    if (!zarizeniKPridani)
        return;
    mojeSit.push(zarizeniKPridani);
    vykresliMojeSit();
    aktualizujSouhrn();
}
/**
 * Vykreslí "Moje síť" - zařízení, která uživatel přidal.
 */
function vykresliMojeSit() {
    const container = document.getElementById('network-list');
    if (!container)
        return;
    container.innerHTML = '';
    // Pokud je síť prázdná, zobraz info text
    if (mojeSit.length === 0) {
        container.innerHTML = '<p class="empty">Zatím nic. Přidej zařízení z katalogu.</p>';
        return;
    }
    // Vykresli každé zařízení v síti jako kartu s tlačítkem "× Odebrat"
    for (let i = 0; i < mojeSit.length; i++) {
        const z = mojeSit[i];
        const karta = document.createElement('div');
        karta.className = 'card';
        karta.innerHTML = `
            <div class="card-name">${z.getName()}</div>
            <div class="card-info">Cena: ${z.getPrice()} Kč</div>
            <div class="card-info">Spotřeba: ${z.getPowerConsumption()} W</div>
            <div class="card-info">Propustnost: ${z.calculateThroughput()} Mbps</div>
            <button class="card-button card-button-remove" data-index="${i}">× Odebrat</button>
        `;
        container.appendChild(karta);
    }
}
/**
 * Přepočítá a aktualizuje souhrn ve footeru.
 */
function aktualizujSouhrn() {
    let cena = 0;
    let spotreba = 0;
    let propustnost = 0;
    for (const z of mojeSit) {
        cena += z.getPrice();
        spotreba += z.getPowerConsumption();
        propustnost += z.calculateThroughput();
    }
    const elCena = document.getElementById('total-price');
    const elSpotreba = document.getElementById('total-power');
    const elPropustnost = document.getElementById('total-throughput');
    if (elCena)
        elCena.textContent = `${cena} Kč`;
    if (elSpotreba)
        elSpotreba.textContent = `${spotreba} W`;
    if (elPropustnost)
        elPropustnost.textContent = `${propustnost} Mbps`;
}
// =============================================================
// EVENT LISTENERS - reakce na uživatelské akce
// =============================================================
// Globální event listener - klik kdekoliv na stránce
document.addEventListener('click', (event) => {
    const target = event.target;
    // Klik na "+ Přidat" v katalogu
    if (target.classList.contains('card-button') && !target.classList.contains('card-button-remove')) {
        const id = target.getAttribute('data-id');
        if (id)
            pridejDoSite(id);
    }
    // Klik na "× Odebrat" v Moje síť
    if (target.classList.contains('card-button-remove')) {
        const indexStr = target.getAttribute('data-index');
        if (indexStr) {
            const index = parseInt(indexStr);
            mojeSit.splice(index, 1);
            vykresliMojeSit();
            aktualizujSouhrn();
        }
    }
});
// =============================================================
// INICIALIZACE - spustit při načtení stránky
// =============================================================
vykresliKatalog();
vykresliMojeSit();
