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
// HLAVNÍ LOGIKA - test funkčnosti tříd v konzoli
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
// Výpis do konzole - polymorfní volání metod
console.log("=== Inventář síťových zařízení ===\n");
let celkovaCena = 0;
let celkovaSpotreba = 0;
let celkovaPropustnost = 0;
for (const z of zarizeni) {
    console.log(z.getInfo());
    console.log(`  → propustnost: ${z.calculateThroughput()} Mbps\n`);
    celkovaCena += z.getPrice();
    celkovaSpotreba += z.getPowerConsumption();
    celkovaPropustnost += z.calculateThroughput();
}
console.log("=== Souhrn sítě ===");
console.log(`Celková cena: ${celkovaCena} Kč`);
console.log(`Celková spotřeba: ${celkovaSpotreba} W`);
console.log(`Celková propustnost: ${celkovaPropustnost} Mbps`);
