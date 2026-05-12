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

