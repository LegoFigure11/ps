import * as fs from 'fs';
import * as path from 'path';

import {Sets, Teams} from '../index';

describe('Bundle', () => {
  it('usage', () => {
    {
      const window = {} as { PokemonSets: typeof Sets; PokemonTeams: typeof Teams };
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync(path.resolve(__dirname, '../../build/production.min.js'), 'utf8'));
      const raw =
`Tangrowth @ Assault Vest
Ability: Regenerator
EVs: 248 HP / 8 Def / 252 SpD
Sassy Nature
IVs: 30 Atk / 30 Def
- Giga Drain
- Knock Off
- Hidden Power [Ice]
- Earthquake
`;
      const set = window.PokemonSets.importSet(raw);
      const team = window.PokemonTeams.importTeam(raw)!;
      expect(set.ability).toBe('Regenerator');
      expect(set.moves).toContain('Knock Off');
      expect(team.team).toHaveLength(1);
      expect(team.team[0]).toEqual(set);
    }
  });
});
