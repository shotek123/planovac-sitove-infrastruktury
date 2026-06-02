declare const katalog: any[];
/**
 * Abstraktní třída reprezentující obecné síťové zařízení.
 * Slouží jako společný základ pro Router a Switch.
 * Z této třídy nelze přímo vytvořit objekt (kvůli klíčovému slovu abstract).
 */
abstract class NetworkDevice {
    // Soukromé atributy - dostupné jen uvnitř této třídy
    private id: string;
    private name: string;
    private price: number;
    private powerConsumption: number;

    /**
     * Konstruktor - spustí se automaticky při new Router(...) nebo new Switch(...).
     * Nejdřív zkontroluje hodnoty, pak je uloží do atributů.
     */
    constructor(id: string, name: string, price: number, powerConsumption: number) {
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

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }

    public getPowerConsumption(): number {
        return this.powerConsumption;
    }

    /**
     * Vrátí textový popis zařízení - hodí se pro výpis v konzoli.
     */
    public getInfo(): string {
        return `${this.name} (ID: ${this.id}, cena: ${this.price} Kč, spotřeba: ${this.powerConsumption} W)`;
    }

    /**
     * Abstraktní metoda - každý potomek si ji musí napsat po svém.
     * Tady se projeví POLYMORFISMUS - Router a Switch budou propustnost
     * počítat jinak.
     */
    abstract calculateThroughput(): number;
}

class Router extends NetworkDevice {
    private wanSpeed: number;

    constructor(id: string, name: string, price: number, powerConsumption: number, wanSpeed: number) {
        super(id, name, price, powerConsumption);

        if (wanSpeed < 0) {
            throw new Error("WAN rychlost nesmí být záporná");
        }

        this.wanSpeed = wanSpeed;
    }

    public getWanSpeed(): number {
        return this.wanSpeed;
    }

    public calculateThroughput(): number {
        return this.wanSpeed;
    }
}

/**
 * Switch - druhý konkrétní typ síťového zařízení.
 * Dědí všechny společné vlastnosti z NetworkDevice.
 * Navíc si přidává počet portů a rychlost jednoho portu.
 */
class Switch extends NetworkDevice {
    private portCount: number;
    private portSpeed: number;

    constructor(id: string, name: string, price: number, powerConsumption: number, portCount: number, portSpeed: number) {
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

    public getPortCount(): number {
        return this.portCount;
    }

    public getPortSpeed(): number {
        return this.portSpeed;
    }

    /**
     * Implementace abstraktní metody z rodiče.
     * U switche se propustnost počítá jako součet rychlostí všech portů.
     */
    public calculateThroughput(): number {
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
function vytvoritZarizeni(data: any): NetworkDevice {
    if (data.type === 'router') {
        return new Router(data.id, data.name, data.price, data.powerConsumption, data.wanSpeed);
    } else {
        return new Switch(data.id, data.name, data.price, data.powerConsumption, data.portCount, data.portSpeed);
    }
}

// Vytvoření pole instancí z katalogu (= "oživení" surových dat)
const zarizeni: NetworkDevice[] = katalog.map(vytvoritZarizeni);

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

/**
 * Funkce reagující na klik na tlačítko - vypíše počet zařízení v síti.
 */
function spocitejZarizeni(): void {
    const pocet = zarizeni.length;
    alert(`V síti je celkem ${pocet} zařízení.`);
}

// Najdi tlačítko v HTML a navěs na něj funkci spocitejZarizeni při kliku
document.getElementById('btn-spocitej')?.addEventListener('click', spocitejZarizeni);