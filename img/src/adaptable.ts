import {Data, GenerationNum} from './data/interface';

type Gender = 'M' | 'F' | 'N';
type SideID = 'p1' | 'p2';
type Protocol = 'https' | 'http';
type Facing = 'front' | 'frontf' | 'back' | 'backf';

const PROTOCOL = 'https';
const DOMAIN = 'play.pokemonshowdown.com';
const URL = (options?: {protocol?: Protocol, domain?: string}) => {
  const url =  `${options?.protocol ?? PROTOCOL}://${options?.domain ?? DOMAIN}`;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export type GraphicsGen = keyof typeof GENS;

const GENS = {
  'gen1rg': 1,
  'gen1rb': 1,
  'gen1': 1,
  'gen2g': 2,
  'gen2s': 2,
  'gen2': 2,
  // 'gen2ani': 2,
  'gen3rs': 3,
  'gen3frlg': 3,
  'gen3': 3,
  // 'gen3ani': 3,
  'gen4dp': 4,
  // 'gen4dpani': 4,
  'gen4': 4,
  // 'gen4ani': 4,
  // 'gen4hgss': 4,
  // 'gen4hgssani': 4,
  'gen5': 5,
  'gen5ani': 5,
  // 'static': 6,
  'ani': 6,
};

export type AnimatedGraphicsGen = keyof typeof ANIMATED;
const ANIMATED = {
  'gen5ani': 'gen5' as GraphicsGen,
  'ani': 'dex' as GraphicsGen,
};

const SOURCES: {[name: string]: GraphicsGen} = {
  'Green': 'gen1rg',
  'Red/Blue': 'gen1rb',
  'Yellow': 'gen1',
  'Gold': 'gen2g',
  'Silver': 'gen2s',
  'Crystal': 'gen2',
  // 'Crystal (Animated)': 'gen2ani',
  'Ruby/Sapphire': 'gen3rs',
  'FireRed/LeafGreen': 'gen3frlg',
  'Emerald': 'gen3',
  // 'Emerald (Animated)': 'gen3ani',
  'Diamond/Pearl': 'gen4dp',
  // 'Diamond/Pearl (Animated)': 'gen4dpani',
  'Platinum': 'gen4',
  // 'Platinum (Animated)': 'gen4ani':
  // 'HeartGold/SoulSilver': 'gen4hgss':
  // 'HeartGold/SoulSilver (Animated)': 'gen4hgssani':
  'Black/White': 'gen5',
  'Black/White (Animated)': 'gen5ani',
  // 'Modern': 'noani',
  'Modern (Animated)': 'ani',
};

export interface PokemonSprite {
  gen: GenerationNum;
  w: number;
  h: number;
  url: string;
  pixelated?: boolean;
}

export class Sprites {
  static SOURCES = SOURCES;
  static GENS = GENS;
  static ANIMATED = ANIMATED;

  readonly data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  getPokemon(
    name: string,
    options?: {
      gen?: GenerationNum;
      graphics?: GraphicsGen;
      side?: SideID,
      gender?: Gender,
      shiny?: boolean,
      protocol?: Protocol,
      domain?: string,
    }
  ) {
    const url = `${URL(options)}/sprites`;
    const data = this.data.getPokemon(name);
    if (!data) {
      // If we can't figure out the Pokemon in question we just return a question mark icon
      return {gen: 5, w: 96, h: 96, url: `${url}/gen5/0.png`, pixelated: true};
    }

    let graphics = options?.graphics;
    // If graphics have been set, convert it into a generation and use it, otherwise, rely on the
    // context generation (or fallback to gen 6).
    // NOTE: We're deliberately not checking `options?.graphics === undefined` here because `''`
    // can be used for the 'default' which is to just rely on the context generation.
    const max = graphics ? Sprites.GENS[graphics] as GenerationNum : options?.gen || 6;
    // Regardless of the generation context, we can only go back to the first generation
    // the Pokemon existed in (or BW, because the Smogon sprite project guarantees BW sprites).
    const min = Math.min(data.gen, 5) as GenerationNum;

    const gen = Math.max(max, min) as GenerationNum;
    if (!graphics || gen !== Sprites.GENS[graphics]) {
      graphics = (min < 5 ? `gen${min}` : 'ani') as GraphicsGen;
    }

    let dir: string = graphics;
    let facing: Facing  = 'front';
    if (options?.side === 'p1') {
      dir += '-back';
      facing = 'back';
    }
    if (options?.shiny && gen > 1) dir += '-shiny';

    // Missing back sprites
    if (dir.startsWith('gen1rg-back') || dir.startsWith('gen1rb-back')) {
      dir = `gen1-back${dir.slice(11)}`;
    } else if (dir.startsWith('gen2g-back') || dir.startsWith('gen2s-back')) {
      dir = `gen2-back${dir.slice(10)}`;
    } else if (dir.startsWith('gen3rs-back')) {
      dir = `gen3-back${dir.slice(11)}`;
    } else if (dir.startsWith('gen3frlg-back')) {
      dir = `gen3-back${dir.slice(13)}`;
    } else if (dir.startsWith('gen4dp-back')) {
      dir = `gen4-back${dir.slice(11)}`;
    }

    // FRLG added new sprites for Kanto Pokemon only
    if (dir.startsWith('gen3frlg') && data.gen === 1 && data.num <= 151) {
      dir = `gen3${dir.slice(8)}`;
    }

    const facingf = facing + 'f' as 'frontf' | 'backf';
    if (graphics in Sprites.ANIMATED) {
      const d = graphics === 'gen5ani' ? (data.bw ?? {}) : data;
      if (d[facingf] && options?.gender === 'F') facing = `${facing}f` as Facing;

      if (d[facing]) {
        const w = d[facing]!.w ?? 96;
        const h = d[facing]!.h ?? 96;
        const file = facing.endsWith('f') ? `${data.id}-f` : data.id;

        return {gen, w, h, url: `${url}/${dir}/${file}.gif`, pixelated: gen <= 5};
      }

      dir = `gen5${dir.slice(graphics.length)}`;
    } else if ((data[facingf] && options?.gender === 'F')) {
      facing = `${facing}f` as Facing
    }
    // Visual gender differences didn't exist for sprites until Gen 4
    const file = (data.gen >= 4 && data[facing] && facing.endsWith('f')) ? `${data.id}-f` : data.id;

    return {gen, w: 96, h: 96, url: `${url}/${dir}/${file}.png`, pixelated: true};
  }

  getDexPokemon(
    name: string,
    options?: {
      gen?: GenerationNum;
      graphics?: GraphicsGen | 'dex';
      shiny?: boolean,
      protocol?: Protocol,
      domain?: string,
    }
  ) {
    let graphics = options?.graphics ?? 'dex';
    if (graphics in Sprites.ANIMATED) graphics = Sprites.ANIMATED[graphics as AnimatedGraphicsGen];
    const data = this.data.getPokemon(name);
    if (!data || graphics !== 'dex' || !data.dex) return this.getPokemon(name, options as any);

    const gen = Math.max(data.gen, 6);
    const size = data.gen >= 7 ? 128 : 120;
    const url = `${URL(options)}/sprites/dex/${data.id}.png`;

    return {gen, w: size, height: size, url};
  }

  getSubstitute(
    gen: GenerationNum = 8,
    options?: {side: SideID, protocol?: Protocol, domain?: string}
  ) {
    const url = `${URL(options)}/substitutes`;
    let dir: string;
    let iw = 0; // TODO innerWidth
    let ih = 0; // TODO innerHeight
    if (gen < 3) {
      dir = 'gen1';
    } else if (gen < 4) {
      dir = 'gen3';
    } else if (gen < 5) {
      dir = 'gen4';
    } else {
      dir = 'gen5';
    }
    if (options?.side === 'p1') dir += '-back';
    return {gen, w: 96, h: 96, iw, ih, url: `${url}/${dir}/substitute.png`, pixelated: true};
  }

  getAvatar(avatar: string, options?: {protocol?: Protocol, domain?: string}) {
    avatar = this.data.getAvatar(avatar) ?? avatar;
    const url = `${URL(options)}/sprites/trainers`
    return (avatar.charAt(0) === '#'
      ? `${url}-custom/${avatar.substring(1)}.png`
      : `${url}/${sanitizeName(avatar || 'unknown')}.png`);
  }
}

export class Icons {
  readonly data: Data;

  constructor(data: Data) {
    this.data = data;
  }

  getPokemon(
    name: string,
    options?: {
      side?: SideID,
      gender?: Gender,
      fainted?: boolean,
      protocol?: Protocol,
      domain?: string,
    }
  ) {
    const num = 0; // TODO name gender left

    const top = -Math.floor(num / 12) * 30;
    const left = -(num % 12) * 40;
    const extra = options?.fainted? ';opacity:.3;filter:grayscale(100%) brightness(.5)' : '';

    const url = `${URL(options)}/sprites/pokemonicons-sheet.png`;
    const base = 'width:40px;height:30px;image-rendering:pixelated';
    const style =
      `${base};background:transparent url(${url}) no-repeat scroll ${left}px ${top}px${extra}`;
    return {style, url, left, top, extra};
  }

  getPokeball(name: string, options?: {protocol?: Protocol, domain?: string}) {
    let left = 0;
    let top = 0;
    let extra = '';
    if (name === 'pokeball') {
      left = 0;
      top = 4;
    } else if (name === 'pokeball-statused') {
      left = -40;
      top = 4;
    } else if (name === 'pokeball-fainted') {
      left = 80;
      top = 4;
      extra = ';opacity:.4;filter:contrast(0)'
    } else if (name === 'pokeball-none') {
      left = -80;
      top = 4;
    } else {
      return undefined;
    }
    const url = `${URL(options)}/sprites/pokemonicons-pokeball-sheet.png`;
    const base = 'width:40px;height:30px;image-rendering:pixelated';
    const style =
      `${base};background:transparent url(${url}) no-repeat scroll ${left}px ${top}px${extra}`;
    return {style, url, left, top, extra};
  }

  getItem(name: string, options?: {protocol?: Protocol, domain?: string}) {
    const num = this.data.getItem(name)?.spritenum ?? 0;
    const top = -Math.floor(num / 16) * 24;
    const left = -(num % 16) * 24;
    const url = `${URL(options)}/sprites/itemicons-sheet.png`;
    const base = 'width:24px;height:24x;image-rendering:pixelated';
    const style = `${base};background:transparent url(${url}) no-repeat scroll ${left}px ${top}px`;
    return {style, url, top, left};
  }

  getType(name: string, options?: {protocol?: Protocol, domain?: string}) {
    const type = name === '???'
      ? '%3f%3f%3f'
      : `${name.charAt(0).toUpperCase()}${(name).substr(1).toLowerCase()}`;
    const url = `${URL(options)}/sprites/types/${type}.png`;
    return {url, type, w: 32, h: 14};
  }
}

function sanitizeName(name: any) {
  if (!name) return '';
  return ('' + name)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .slice(0, 50);
}
