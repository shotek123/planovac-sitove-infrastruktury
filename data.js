"use strict";
/**
 * Datový číselník - katalog síťových zařízení.
 * Obsahuje pole prostých objektů (ne instance tříd).
 * Z těchto dat se v hlavním souboru vytvoří instance tříd Router a Switch.
 */
const katalog = [
    // Routery
    { id: 'r1', type: 'router', name: 'MikroTik hAP ac²', price: 1490, powerConsumption: 7, wanSpeed: 1000 },
    { id: 'r2', type: 'router', name: 'TP-Link Archer C6', price: 990, powerConsumption: 9, wanSpeed: 1000 },
    { id: 'r3', type: 'router', name: 'Asus RT-AX55', price: 1990, powerConsumption: 12, wanSpeed: 1000 },
    // Switche
    { id: 's1', type: 'switch', name: 'TP-Link TL-SG108', price: 590, powerConsumption: 4, portCount: 8, portSpeed: 1000 },
    { id: 's2', type: 'switch', name: 'D-Link DGS-1016D', price: 2490, powerConsumption: 8, portCount: 16, portSpeed: 1000 },
    { id: 's3', type: 'switch', name: 'MikroTik CRS305', price: 3290, powerConsumption: 12, portCount: 5, portSpeed: 10000 },
];
