import paletteUrl from './assets/palette.png';

export type Palette = {
    name: string,
    colors: Record<ColorVarName, string>,
}

export const themes = [
    "acid",           "airline",         "argon",         "autumn",
    "BASIC",          "berry",           "birthday cake", "bloodmoon",
    "blueprint",      "bordeaux",        "brink",         "cacao",
    "champagne",      "chemical",        "chococherry",   "classic",
    "clean",          "concrete",        "console",       "cowboy",
    "dagobah",        "debugger",        "delicate",      "desert world",
    "disassembly",    "dorado",          "dusk",          "elephant",
    "epaper",         "epaper invert",   "evening",       "F7200",
    "florist",        "formal",          "galactic",      "gatecrasher",
    "gothmode",       "grapefrukt",      "grappa",        "gunmetal",
    "hazard",         "heirloom",        "holosphere",    "hope",
    "hot",            "hyperspace",      "ice world",     "incorporated",
    "infographic",    "invert",          "jaune",         "juicy",
    "kicks",          "lab",             "lava world",    "lemonade",
    "lichen",         "lightcycle",      "line",          "m",
    "machine",        "metoro",          "midnight",      "minus",
    "mir",            "mono",            "moonbase",      "mustard",
    "mute",           "nemk",            "neptune",       "neutrality",
    "noctis",         "oceanographer",   "okinami",       "orbit",
    "pale",           "papier",          "papier invert", "party",
    "petal",          "PICO-8",          "pinku",         "plus",
    "porphyrous",     "poseidon",        "powder",        "pulse",
    "pumpkin",        "QDUST",           "quench",        "regal",
    "replicant",      "retro",           "rust",          "sakura",
    "shift",          "shock",           "simulator",     "sinister",
    "solarized dark", "solarized light", "starfighter",   "sunset",
    "supernavy",      "synergy",         "talisman",      "toothpaste",
    "toxin",          "TR-808",          "tycho",         "vasquez",
    "vectrex",        "vintage",         "virtual",       "vivid",
    "void",           "waka",            "witchy",        "wizard",
    "wyvern",         "xenon",           "yeti",          //"custom",
];

// Names of palette files in alphabetical order.
// We expect custom palette files to be ordered alphabetically.
const paletteFileNames = [
    'background',
    'editor',
    'entityBat',
    'entityBoostPad',
    'entityBounceBlock',
    'entityDoorExit',
    'entityDoorExitSwitch',
    'entityDoorLocked',
    'entityDoorRegular',
    'entityDoorTrap',
    'entityDroneChaingun',
    'entityDroneChaser',
    'entityDroneLaser',
    'entityDroneZap',
    'entityDualLaser',
    'entityEvilNinja',
    'entityEyeBat',
    'entityFloorGuard',
    'entityGold',
    'entityLaunchPad',
    'entityMine',
    'entityOneWayPlatform',
    'entityRocket',
    'entityShoveThwomp',
    'entityThwomp',
    'entityTurret',
    'explosions',
    'fxDroneZap',
    'fxFloorguardZap',
    'fxNinja',
    'headbands',
    'menu',
    'ninja',
    'timeBar',
    'timeBarRace',
] as const;

type PaletteFileName = typeof paletteFileNames[number];

// From https://github.com/edelkas/inne/blob/e6a34df9fa6762271e5bb7084a24e3cd2c868c55/src/maps.rb#L168
const outtePaletteOrder: Record<PaletteFileName, number> = {
    background: 0,
    ninja: 1,
    entityMine: 2,
    entityGold: 3,
    entityDoorExit: 4,
    entityDoorExitSwitch: 5,
    entityDoorRegular: 6,
    entityDoorLocked: 7,
    entityDoorTrap: 8,
    entityLaunchPad: 9,
    entityOneWayPlatform: 10,
    entityDroneChaingun: 11,
    entityDroneLaser: 12,
    entityDroneZap: 13,
    entityDroneChaser: 14,
    entityFloorGuard: 15,
    entityBounceBlock: 16,
    entityRocket: 17,
    entityTurret: 18,
    entityThwomp: 19,
    entityEvilNinja: 20,
    entityDualLaser: 21,
    entityBoostPad: 22,
    entityBat: 23,
    entityEyeBat: 24,
    entityShoveThwomp: 25,
    headbands: 26,
    explosions: 27,
    timeBar: 28,
    timeBarRace: 29,
    fxNinja: 30,
    fxDroneZap: 31,
    fxFloorguardZap: 32,
    menu: 33,
    editor: 34,
};

const paletteSize: Record<PaletteFileName, number> = {
    background: 6,
    ninja: 4,
    entityMine: 4,
    entityGold: 3,
    entityDoorExit: 8,
    entityDoorExitSwitch: 5,
    entityDoorRegular: 1,
    entityDoorLocked: 8,
    entityDoorTrap: 8,
    entityLaunchPad: 2,
    entityOneWayPlatform: 2,
    entityDroneChaingun: 2,
    entityDroneLaser: 4,
    entityDroneZap: 2,
    entityDroneChaser: 2,
    entityFloorGuard: 2,
    entityBounceBlock: 2,
    entityRocket: 4,
    entityTurret: 5,
    entityThwomp: 3,
    entityEvilNinja: 2,
    entityDualLaser: 2,
    entityBoostPad: 2,
    entityBat: 3,
    entityEyeBat: 2,
    entityShoveThwomp: 3,
    headbands: 17,
    explosions: 4,
    timeBar: 8,
    timeBarRace: 17,
    fxNinja: 2,
    fxDroneZap: 2,
    fxFloorguardZap: 2,
    menu: 42,
    editor: 10,
};

const outtePaletteIndex: Record<PaletteFileName, number> = (() => {
    const paletteIndex = {} as Record<PaletteFileName, number>;
    for (const file of paletteFileNames) {
        paletteIndex[file] = 0;
        for (const other of paletteFileNames) {
            if (outtePaletteOrder[other] < outtePaletteOrder[file]) {
                paletteIndex[file] += paletteSize[other];
            }
        }
    }
    return paletteIndex;
})();

const colorVarNames = [
    '--main-menu-text',
    '--main-menu-selected',
    '--tiles',
    '--tile-outline',
    '--background',
    '--ninja',
    '--mine-exterior',
    '--mine-interior',
    '--toggle-mine',
    '--toggling-mine',
    '--bounceblock-interior',
    '--bounceblock-border',
    '--oneway-long',
    '--oneway-short',
    '--boost-pad',
    '--boost-pad-wooshing',
    '--launch-pad-short',
    '--launch-pad-long',
    '--exit-panel',
    '--exit-border',
    '--open-exit-upper',
    '--open-exit-lower',
    '--exit-switch-border',
    '--exit-switch-background',
    '--exit-switch-border-collected',
    '--exit-switch-background-collected',
    '--exit-switch-center',
    '--regular-door',
    '--locked-door-bar',
    '--locked-door-center',
    '--locked-switch-border',
    '--locked-switch-background',
    '--locked-switch-button',
    '--locked-switch-border-collected',
    '--locked-switch-background-collected',
    '--locked-switch-button-collected',
    '--trap-door-bar',
    '--trap-door-center',
    '--trap-switch-border',
    '--trap-switch-background',
    '--trap-switch-border-collected',
    '--trap-switch-background-collected',
    '--thwump-border',
    '--thwump-interior',
    '--thwump-ray',
    '--shove-thwump-armor',
    '--shove-thwump-ray',
    '--shove-thwump-center',
    '--zap-drone-background',
    '--zap-drone-border',
    '--chaingun-drone-background',
    '--chaingun-drone-border',
    '--bat-body',
    '--bat-eye',
    '--time-remaining',
    '--hardcore-time',
    '--empty-timebar',
    '--regular-grid',
    '--fine-grid',
    '--door-switch-line',
    '--editor-crosshair',
    '--tiles-selected',
    '--entity-arrows',
    '--entity-palette-reticle',
] as const;

type ColorVarName = typeof colorVarNames[number];

// Based on https://pastebin.com/E01pEhy4
const colorVarPaletteLocations: Record<ColorVarName, { file: PaletteFileName, index: number }> = {
    '--main-menu-text': {
        file: 'menu',
        index: 4,
    },
    '--main-menu-selected': {
        file: 'menu',
        index: 10,
    },
    '--tiles': {
        file: 'background',
        index: 0,
    },
    '--tile-outline': {
        file: 'background',
        index: 1,
    },
    '--background': {
        file: 'background',
        index: 2,
    },
    '--ninja': {
        file: 'ninja',
        index: 0,
    },
    '--mine-exterior': {
        file: 'entityMine',
        index: 0,
    },
    '--mine-interior': {
        file: 'entityMine',
        index: 1,
    },
    '--toggle-mine': {
        file: 'entityMine',
        index: 2,
    },
    '--toggling-mine': {
        file: 'entityMine',
        index: 3,
    },
    '--bounceblock-interior': {
        file: 'entityBounceBlock',
        index: 0,
    },
    '--bounceblock-border': {
        file: 'entityBounceBlock',
        index: 1,
    },
    '--oneway-long': {
        file: 'entityOneWayPlatform',
        index: 0,
    },
    '--oneway-short': {
        file: 'entityOneWayPlatform',
        index: 1,
    },
    '--boost-pad': {
        file: 'entityBoostPad',
        index: 0,
    },
    '--boost-pad-wooshing': {
        file: 'entityBoostPad',
        index: 1,
    },
    '--launch-pad-short': {
        file: 'entityLaunchPad',
        index: 1,
    },
    '--launch-pad-long': {
        file: 'entityLaunchPad',
        index: 0,
    },
    '--exit-panel': {
        file: 'entityDoorExit',
        index: 0,
    },
    '--exit-border': {
        file: 'entityDoorExit',
        index: 1,
    },
    '--open-exit-upper': {
        file: 'entityDoorExit',
        index: 2,
    },
    '--open-exit-lower': {
        file: 'entityDoorExit',
        index: 3,
    },
    '--exit-switch-border': {
        file: 'entityDoorExitSwitch',
        index: 0,
    },
    '--exit-switch-background': {
        file: 'entityDoorExitSwitch',
        index: 3,
    },
    '--exit-switch-border-collected': {
        file: 'entityDoorExitSwitch',
        index: 1,
    },
    '--exit-switch-background-collected': {
        file: 'entityDoorExitSwitch',
        index: 4,
    },
    '--exit-switch-center': {
        file: 'entityDoorExitSwitch',
        index: 2,
    },
    '--regular-door': {
        file: 'entityDoorRegular',
        index: 0,
    },
    '--locked-door-bar': {
        file: 'entityDoorLocked',
        index: 0,
    },
    '--locked-door-center': {
        file: 'entityDoorLocked',
        index: 1,
    },
    '--locked-switch-border': {
        file: 'entityDoorLocked',
        index: 4,
    },
    '--locked-switch-background': {
        file: 'entityDoorLocked',
        index: 7,
    },
    '--locked-switch-button': {
        file: 'entityDoorLocked',
        index: 2,
    },
    '--locked-switch-border-collected': {
        file: 'entityDoorLocked',
        index: 5,
    },
    '--locked-switch-background-collected': {
        file: 'entityDoorLocked',
        index: 6,
    },
    '--locked-switch-button-collected': {
        file: 'entityDoorLocked',
        index: 3,
    },
    '--trap-door-bar': {
        file: 'entityDoorTrap',
        index: 0,
    },
    '--trap-door-center': {
        file: 'entityDoorTrap',
        index: 1,
    },
    '--trap-switch-border': {
        file: 'entityDoorTrap',
        index: 4,
    },
    '--trap-switch-background': {
        file: 'entityDoorTrap',
        index: 6,
    },
    '--trap-switch-border-collected': {
        file: 'entityDoorTrap',
        index: 5,
    },
    '--trap-switch-background-collected': {
        file: 'entityDoorTrap',
        index: 7,
    },
    '--thwump-border': {
        file: 'entityThwomp',
        index: 0,
    },
    '--thwump-interior': {
        file: 'entityThwomp',
        index: 1,
    },
    '--thwump-ray': {
        file: 'entityThwomp',
        index: 2,
    },
    '--shove-thwump-armor': {
        file: 'entityShoveThwomp',
        index: 2,
    },
    '--shove-thwump-ray': {
        file: 'entityShoveThwomp',
        index: 1,
    },
    '--shove-thwump-center': {
        file: 'entityShoveThwomp',
        index: 0,
    },
    '--zap-drone-background': {
        file: 'entityDroneZap',
        index: 0,
    },
    '--zap-drone-border': {
        file: 'entityDroneZap',
        index: 1,
    },
    '--chaingun-drone-background': {
        file: 'entityDroneChaingun',
        index: 0,
    },
    '--chaingun-drone-border': {
        file: 'entityDroneChaingun',
        index: 1,
    },
    '--bat-body': {
        file: 'entityBat',
        index: 0,
    },
    '--bat-eye': {
        file: 'entityBat',
        index: 1,
    },
    '--time-remaining': {
        file: 'timeBar',
        index: 0,
    },
    '--hardcore-time': {
        file: 'timeBar',
        index: 1,
    },
    '--empty-timebar': {
        file: 'timeBar',
        index: 2,
    },
    '--regular-grid': {
        file: 'editor',
        index: 0,
    },
    '--fine-grid': {
        file: 'editor',
        index: 2,
    },
    '--door-switch-line': {
        file: 'editor',
        index: 5,
    },
    '--editor-crosshair': {
        file: 'editor',
        index: 3,
    },
    '--tiles-selected': {
        file: 'editor',
        index: 8,
    },
    '--entity-arrows': {
        file: 'editor',
        index: 4,
    },
    '--entity-palette-reticle': {
        file: 'editor',
        index: 6,
    },
};

let paletteCtx: CanvasRenderingContext2D | undefined = undefined;

export async function loadStandardPalettes() {
    const res = await fetch(paletteUrl);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    paletteCtx = ctx;
}

export function getPaletteColors(theme: string): Record<ColorVarName, string> | undefined {
    const ctx = paletteCtx;
    const themeIndex = themes.indexOf(theme);
    if (!ctx || themeIndex < 0) return;
    const colors = {} as Record<ColorVarName, string>;
    for (const colorName of colorVarNames) {
        const { file, index } = colorVarPaletteLocations[colorName];
        const colorIndex = outtePaletteIndex[file] + index;
        const pixel = ctx.getImageData(colorIndex, themeIndex, 1, 1).data;
        const color = `rgb(${pixel[0]} ${pixel[1]} ${pixel[2]})`;
        colors[colorName] = color;
    }
    return colors;
}

export function updatePaletteCss(colors: Record<ColorVarName, string>) {
    for (const colorName of colorVarNames) {
        document.body.style.setProperty(colorName, colors[colorName]);
    }
}
