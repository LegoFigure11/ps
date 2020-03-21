import {Protocol, Args, KWArgs} from '@pkmn/protocol';
import {ID, toID, StatName, BoostName, BoostsTable} from '@pkmn/sim';
import {Battle} from './battle';

const BOOSTS: BoostName[] = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];

export class Handler implements Protocol.Handler {
  readonly battle: Battle;
  readonly player: ID | null;

  constructor(battle: Battle, player = null) {
    this.battle = battle;
    this.player = player;
  }

  '|start|'(args: Args['|start|']) {
		this.battle.p1.active[0] = null;
		this.battle.p2.active[0] = null;
  }

  '|upkeep|'(args: Args['|upkeep|']) {
    this.battle.field.updatePseudoWeatherLeft();
    this.battle.updateToxicTurns();
  }

  '|turn|'(args: Args['|turn|']) {
    this.battle.setTurn(args[1]);
  }

  '|tier|'(args: Args['|tier|']) {
    this.battle.tier = args[1];
    if (this.battle.tier.slice(-13) === 'Random Battle') {
      this.battle.speciesClause = true;
    }
  }

  '|gametype|'(args: Args['|gametype|']) {
    this.battle.gameType = args[1];
    switch (args[1]) {
    default:
      this.battle.p1.active = [null];
      this.battle.p2.active = [null];
      break;
    case 'doubles':
      this.battle.p1.active = [null, null];
      this.battle.p2.active = [null, null];
      break;
    case 'triples':
    case 'rotation':
      this.battle.p1.active = [null, null, null];
      this.battle.p2.active = [null, null, null];
      break;
    }
  }

  '|rule|'(args: Args['|rule|']) {
    let ruleName = args[1].split(': ')[0];
    if (ruleName === 'Species Clause') this.battle.speciesClause = true;
  }

  '|rated|'(args: Args['|rated|']) {
    this.battle.rated = args[1] || true;
  }

  '|inactive|'(args: Args['|inactive|']) {
    if (this.battle.kickingInactive === 'off') this.battle.kickingInactive = 'on-unknown';
    if (args[1].slice(0, 11) === "Time left: ") {
      let [time, totalTime, graceTime] = args[1].split(' | ');
      this.battle.kickingInactive = parseInt(time.slice(11), 10) || 'on-unknown';
      this.battle.totalTimeLeft = parseInt(totalTime, 10);
      this.battle.graceTimeLeft = parseInt(graceTime || '', 10) || 0;
      if (this.battle.totalTimeLeft === this.battle.kickingInactive) this.battle.totalTimeLeft = 0;
      return;
    } else if (args[1].slice(0, 9) === "You have ") {
      // this is ugly but parseInt is documented to work this way
      // so I'm going to be lazy and not chop off the rest of the
      // sentence
      this.battle.kickingInactive = parseInt(args[1].slice(9), 10) || 'on-unknown';
      return;
    } else if (args[1].slice(-14) === ' seconds left.') {
      let hasIndex = args[1].indexOf(' has ');
      if (toID(args[1].slice(0, hasIndex)) === this.player) {
        this.battle.kickingInactive = parseInt(args[1].slice(hasIndex + 5), 10) || 'on-unknown';
      }
    }
  }

  '|inactiveoff|'(args: Args['|inactiveoff|']) {
    this.battle.kickingInactive = 'off';
  }

  '|player|'(args: Args['|player|']) {
    const side = this.battle.getSide(args[1]);
    side.setName(args[2]!);
    if (args[3]) side.setAvatar(args[3]);
    if (args[4]) side.rating = args[4];
  }

  '|teamsize|'(args: Args['|teamsize|']) {
    this.battle.getSide(args[1]).totalPokemon = parseInt(args[2], 10);
  }

  '|clearpoke|'(args: Args['|clearpoke|']) {
    this.battle.p1.clearPokemon();
    this.battle.p2.clearPokemon();
  }

  '|poke|'(args: Args['|poke|']) {
    let pokemon = this.battle.rememberTeamPreviewPokemon(args[1], args[2])!;
    if (args[3] === 'item') pokemon.item = '(exists)';
  }

  '|teampreview|'(args: Args['|teampreview|']) {
    this.battle.teamPreviewCount = parseInt(args[1], 10);
  }

  '|switch|'(args: Args['|switch|']) {
    this.switch(args);
  }

  '|drag|'(args: Args['|drag|']) {
    this.switch(args);
  }

  '|replace|'(args: Args['|replace|']) {
    this.switch(args);
  }

  switch(args: Args['|switch|' | '|drag|' | '|replace|']) {
    const poke = this.battle.getSwitchedPokemon(args[1], args[2])!;
    const slot = poke.slot;
    poke.healthParse(args[3]);
    poke.removeVolatile('itemremoved' as ID);
    if (args[0] === 'switch') {
      if (poke.side.active[slot]) {
        poke.side.switchOut(poke.side.active[slot]!);
      }
      poke.side.switchIn(poke);
    } else if (args[0] === 'replace') {
      poke.side.replace(poke);
    } else {
      poke.side.dragIn(poke);
    }
  }

  '|faint|'(args: Args['|faint|']) {
    const poke = this.battle.getPokemon(args[1])!;
    poke.side.faint(poke);
  }

  '|swap|'(args: Args['|swap|'], kwArgs: KWArgs['|swap|']) {
    if (isNaN(Number(args[2]))) {
      const poke = this.battle.getPokemon(args[1])!;
      poke.side.swapWith(poke, this.battle.getPokemon(args[2])!);
    } else {
      const poke = this.battle.getPokemon(args[1])!;
      const targetIndex = parseInt(args[2], 10);
      // FIXME TextParser
      // if (kwArgs.from) {
      //   const target = poke.side.active[targetIndex];
      //   if (target) args[2] = target.ident;
      // }
      poke.side.swapTo(poke, targetIndex);
    }
  }

  '|move|'(args: Args['|move|'], kwArgs: KWArgs['|move|']) {
    const poke = this.battle.getPokemon(args[1])!;
    const move = this.battle.dex.getMove(args[2]);
    if (this.battle.checkActive(poke)) return;
    const poke2 = this.battle.getPokemon(args[3]);
    poke.useMove(move, poke2, kwArgs);
  }

  '|cant|'(args: Args['|cant|']) {
    const pokemon = this.battle.getPokemon(args[1])!;
    const effect = this.battle.dex.getEffect(args[2]);
    const move = this.battle.dex.getMove(args[3]);
    pokemon.cantUseMove(effect, move);
  }

  '|gen|'(args: Args['|gen|']) {
    this.battle.gen = args[1];
    this.battle.dex = this.battle.dex.mod(`gen${this.battle.gen}`);
  }

  '|-damage|'(args: Args['|-damage|'], kwArgs: KWArgs['|-damage|']) { }

  '|-heal|'(args: Args['|-heal|'], kwArgs: KWArgs['|-heal|']) { }

  '|-sethp|'(args: Args['|-sethp|'], kwArgs: KWArgs['|-sethp|']) { }

  '|-boost|'(args: Args['|-boost|'], kwArgs: KWArgs['|-boost|']) {
    let poke = this.battle.getPokemon(args[1])!;
    let boost: BoostName | 'spc' = args[2];
    if (this.battle.gen === 1 && boost === 'spd') return;
    if (this.battle.gen === 1 && boost === 'spa') boost = 'spc';
    let amount = parseInt(args[3], 10);
    if (amount === 0) return;

    if (!poke.boosts[boost]) poke.boosts[boost] = 0;
    poke.boosts[boost]! += amount;

    if (!kwArgs.silent && kwArgs.from) {
      const effect = this.battle.dex.getEffect(kwArgs.from);
      const ofpoke = this.battle.getPokemon(kwArgs.of);
      if (!(effect.id === 'weakarmor' && boost === 'spe')) {
        if (ofpoke) {
          ofpoke.activateAbility(effect);
        } else if (poke) {
          poke.activateAbility(effect);
        }
      }
    }
  }

  '|-unboost|'(args: Args['|-unboost|'], kwArgs: KWArgs['|-unboost|']) {
    let poke = this.battle.getPokemon(args[1])!;
    let boost: BoostName | 'spc' = args[2];
    if (this.battle.gen === 1 && boost === 'spd') return;
    if (this.battle.gen === 1 && boost === 'spa') boost = 'spc';
    let amount = parseInt(args[3], 10);
    if (amount === 0) return;

    if (!poke.boosts[boost]) poke.boosts[boost] = 0;
    poke.boosts[boost]! -= amount;

    if (!kwArgs.silent && kwArgs.from) {
      const effect = this.battle.dex.getEffect(kwArgs.from);
      const ofpoke = this.battle.getPokemon(kwArgs.of);
      if (ofpoke) {
        ofpoke.activateAbility(effect);
      } else if (poke) {
        poke.activateAbility(effect);
      }
    }
  }

  '|-setboost|'(args: Args['|-setboost|'], kwArgs: KWArgs['|-setboost|']) {
    this.battle.getPokemon(args[1])!.boosts[args[2]] = parseInt(args[3], 10);;
  }

  '|-swapboost|'(args: Args['|-swapboost|'], kwArgs: KWArgs['|-swapboost|']) {
    const poke = this.battle.getPokemon(args[1])!;
    const poke2 = this.battle.getPokemon(args[2])!;
    const boosts = args[3] ? args[3].split(', ') : BOOSTS;
    for (const boost of boosts) {
      const b = boost as BoostName;
      let tmp = poke.boosts[b];
      poke.boosts[b] = poke2.boosts[b];
      if (!poke.boosts[b]) delete poke.boosts[b];
      poke2.boosts[b] = tmp;
      if (!poke2.boosts[b]) delete poke2.boosts[b];
    }
  }

  '|-clearpositiveboost|'(args: Args['|-clearpositiveboost|']) {
    const poke = this.battle.getPokemon(args[1])!;
    for (const boost in poke.boosts) {
      const b = boost as BoostName;
      if (poke.boosts[b]! > 0) delete poke.boosts[b];
    }
  }

  '|-clearnegativeboost|'(args: Args['|-clearnegativeboost|']) {
    const poke = this.battle.getPokemon(args[1])!;
    for (const boost in poke.boosts) {
      const b = boost as BoostName;
      if (poke.boosts[b]! < 0) delete poke.boosts[b];
    }
  }

  '|-copyboost|'(args: Args['|-copyboost|'], kwArgs: KWArgs['|-copyboost|']) {
    const poke = this.battle.getPokemon(args[1])!;
    const frompoke = this.battle.getPokemon(args[2])!;
    const boosts: BoostName[] = args[3] ? args[3].split(', ') : BOOSTS;
    for (const boost of boosts) {
      poke.boosts[boost] = frompoke.boosts[boost];
      if (!poke.boosts[boost]) delete poke.boosts[boost];
    }
    if (this.battle.gen >= 6) {
      const volatilesToCopy = ['focusenergy', 'laserfocus'];
      for (const volatile of volatilesToCopy) {
        if (frompoke.volatiles[volatile]) {
          poke.addVolatile(volatile as ID);
        } else {
          poke.removeVolatile(volatile as ID);
        }
      }
    }
  }

  '|-clearboost|'(args: Args['|-clearboost|'], kwArgs: KWArgs['|-clearboost|']) {
    this.battle.getPokemon(args[1])!.boosts = {};
  }

  '|-invertboost|'(args: Args['|-invertboost|'], kwArgs: KWArgs['|-invertboost|']) {
    const poke = this.battle.getPokemon(args[1])!;
    for (const boost in poke.boosts) {
      const b = boost as BoostName;
      poke.boosts[b] = -poke.boosts[b]!;
    }
  }

  '|-clearallboost|'(args: Args['|-clearallboost|'], kwArgs: KWArgs['|-clearallboost|']) {
    for (const side of this.battle.sides) {
      for (const active of side.active) {
        if (active) active.boosts = {};
      }
    }
  }

  '|detailschange|'(args: Args['|detailschange|'], kwArgs: KWArgs['|detailschange|']) { }
  '|-formechange|'(args: Args['|-formechange|'], kwArgs: KWArgs['|-formechange|']) { }
  '|-fail|'(args: Args['|-fail|'], kwArgs: KWArgs['|-fail|']) { }
  '|-block|'(args: Args['|-block|'], kwArgs: KWArgs['|-block|']) { }
  '|-notarget|'(args: Args['|-notarget|']) { }
  '|-miss|'(args: Args['|-miss|'], kwArgs: KWArgs['|-miss|']) { }
  '|-status|'(args: Args['|-status|'], kwArgs: KWArgs['|-status|']) { }
  '|-curestatus|'(args: Args['|-curestatus|'], kwArgs: KWArgs['|-curestatus|']) { }
  '|-cureteam|'(args: Args['|-cureteam|'], kwArgs: KWArgs['|-cureteam|']) { }
  '|-ohko|'(args: Args['|-ohko|']) { }
  '|-weather|'(args: Args['|-weather|'], kwArgs: KWArgs['|-weather|']) { }
  '|-fieldstart|'(args: Args['|-fieldstart|'], kwArgs: KWArgs['|-fieldstart|']) { }
  '|-fieldend|'(args: Args['|-fieldend|'], kwArgs: KWArgs['|-fieldend|']) { }
  '|-sidestart|'(args: Args['|-sidestart|']) { }
  '|-sideend|'(args: Args['|-sideend|'], kwArgs: KWArgs['|-sideend|']) { }
  '|-start|'(args: Args['|-start|'], kwArgs: KWArgs['|-start|']) { }
  '|-end|'(args: Args['|-end|'], kwArgs: KWArgs['|-end|']) { }
  '|-crit|'(args: Args['|-crit|'], kwArgs: KWArgs['|-crit|']) { }
  '|-supereffective|'(args: Args['|-supereffective|'], kwArgs: KWArgs['|-supereffective|']) { }
  '|-resisted|'(args: Args['|-resisted|'], kwArgs: KWArgs['|-resisted|']) { }
  '|-immune|'(args: Args['|-immune|'], kwArgs: KWArgs['|-immune|']) { }
  '|-item|'(args: Args['|-item|'], kwArgs: KWArgs['|-item|']) { }
  '|-enditem|'(args: Args['|-enditem|'], kwArgs: KWArgs['|-enditem|']) { }
  '|-ability|'(args: Args['|-ability|'], kwArgs: KWArgs['|-ability|']) { }
  '|-endability|'(args: Args['|-endability|'], kwArgs: KWArgs['|-endability|']) { }
  '|-transform|'(args: Args['|-transform|'], kwArgs: KWArgs['|-transform|']) { }
  '|-mega|'(args: Args['|-mega|']) { }
  '|-primal|'(args: Args['|-primal|']) { }
  '|-burst|'(args: Args['|-burst|']) { }
  '|-zpower|'(args: Args['|-zpower|']) { }
  '|-zbroken|'(args: Args['|-zbroken|']) { }
  '|-activate|'(args: Args['|-activate|'], kwArgs: KWArgs['|-activate|']) { }
  '|-fieldactivate|'(args: Args['|-fieldactivate|'], kwArgs: KWArgs['|-fieldactivate|']) { }
  '|-hint|'(args: Args['|-hint|']) { }
  '|-center|'(args: Args['|-center|']) { }
  '|-message|'(args: Args['|-message|']) { }
  '|-combine|'(args: Args['|-combine|']) { }
  '|-waiting|'(args: Args['|-waiting|']) { }
  '|-prepare|'(args: Args['|-prepare|']) { }
  '|-mustrecharge|'(args: Args['|-mustrecharge|']) { }
  '|-hitcount|'(args: Args['|-hitcount|']) { }
  '|-singlemove|'(args: Args['|-singlemove|'], kwArgs: KWArgs['|-singlemove|']) { }
  '|-singleturn|'(args: Args['|-singleturn|'], kwArgs: KWArgs['|-singleturn|']) { }
  '|-anim|'(args: Args['|-anim|']) { }
}
