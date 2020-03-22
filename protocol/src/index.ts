import {
  As,
  BoostName,
  FieldCondition,
  GameType,
  GenderName,
  GenerationNum,
  HPColor,
  ID,
  MoveTarget,
  Player,
  SideCondition,
  StatsTable,
  StatusName,
  Weather,
} from '@pkmn/types';

export {ID} from '@pkmn/types';

export namespace Protocol {
  export type PositionLetter = 'a' | 'b' | 'c';
  /**
   * A Pokémon ID is in the form `POSITION: NAME`.
   *
   *   - `POSITION` is the spot that the Pokémon is in: it consists of the `PLAYER` of the player
   *     (see `|player|`), followed by a position letter (`a` in singles).
   *
   * An inactive Pokémon will not have a position letter.
   *
   * In doubles and triples battles, `a` will refer to the leftmost Pokémon from its trainer's
   * perspective (so the leftmost on your team, and the rightmost on your opponent's team, so
   * `p1a` faces `p2c`, etc).
   *
   * So the layout looks like:
   *
   * Doubles, player 1's perspective:
   *
   *    p2b p2a
   *    p1a p1b
   *
   * Doubles, player 2's perspective:
   *
   *    p1b p1a
   *    p2a p2b
   *
   * In multi and free-for-all battles, players are grouped by parity. That is, `p1` and `p3` share
   * a side, as do `p2` and `p4`. The position letters still follow the same conventions as in
   * double battles, so the layout looks like:
   *
   * Multi, player 1's perspective
   *
   *    p4b p2a
   *    p1a p3b
   *
   *
   *   - `NAME` is the nickname of the Pokémon (or the species name, if no nickname is given).
   *
   * For example: `p1a: Sparky` could be a Charizard named Sparky. `p1: Dragonite` could be an
   * inactive Dragonite being healed by Heal Bell.
   *
   * For most commands, you can just use the position information in the Pokémon ID to identify
   * the Pokémon. Only a few commands actually change the Pokémon in that position (`|switch|`
   * switching, `|replace|` illusion dropping, `|drag|` phazing, and `|detailschange|` permanent
   * forme changes), and these all specify `DETAILS` for you to perform updates with.
   */
  export type PokemonIdent = string & As<'PokemonIdent'>;
  /**
   * A comma-separated list of all information about a Pokemon visible on the battle screen:
   * species, shininess, gender, and level. So it starts with `SPECIES`, adding `, shiny` if it's
   * shiny, `, M` if it's male, `, F` if it's female, `, L##` if it's not level 100.
   *
   * So, for instance, `Deoxys-Speed` is a level 100 non-shiny genderless Deoxys (Speed forme).
   * `Sawsbuck, shiny, F, L50` is a level 50 shiny female Sawsbuck (Spring form).
   *
   * In Team Preview, `DETAILS` will not include information not available in Team Preview (in
   * particular, level and shininess will be left off), and for Pokémon whose forme isn't revealed
   * in Team Preview, it will be given as `-*`. So, for instance, an Arceus in Team Preview would
   * have the details string `Arceus-*`, no matter what kind of Arceus it is.
   */
  export type PokemonDetails = string & As<'PokemonDetails'>;
  /** `` `${ident}|${details}` ``. Tracked for ease of searching. */
  export type PokemonSearchID= string & As<'PokemonSearchID'>;
  /**
   * The switched Pokémon has HP `HP`, and status `STATUS`. `HP` is specified as a fraction; if it
   * is your own Pokémon then it will be `CURRENT/MAX`, if not, it will be `/100` if HP Percentage
   * Mod is in effect and `/48` otherwise. `STATUS` can be left blank, or it can be `slp`, `par`
   * etc.
   */
  export type PokemonHPStatus = string & As<'PokemonHPStatus'>;
  export type PokemonCondition = string & As<'PokemonCondition'>;

  /**
   * A user, the first character being their rank (users with no rank are represented by a space),
   * and the rest of the string being their username.
   */
  export type Username = string & As<'Username'>;
  /**
   * The player's avatar identifier (usually a number, but other values can be used for custom
   * avatars).
   */
  export type AvatarIdent = string & As<'AvatarIdent'>;

  /**
   * The name of an 'effect' (move, ability, item, status, etc).
   *
   * Effects which are moves, abilities or items are prefixed by `move: `, `ability: ` and `item: `
   * respectively, whereas all other effects are unprefixed. For example, `move: Spectral Thief` or
   * `confusion`.
   */
  export type EffectName = string & As<'EffectName'>;
  /** The name of a Pokemon species (unprefixed). */
  export type SpeciesName = string & As<'SpeciesName'>;
  /** The name of an ability (unprefixed). */
  export type AbilityName = string & As<'AbilityName'>;
  /** The name of an item (unprefixed). */
  export type ItemName = string & As<'ItemName'>;
  /** The name of a move (unprefixed). */
  export type MoveName = string & As<'MoveName'>;

  /** An arbitrary message to be displayed as is. */
  export type Message = string & As<'Message'>;
  /** UNIX timestamp; (the number of seconds since 1970). */
  export type Timestamp = string & As<'Timestamp'>;

  /** HTML which should be sanitized before display. */
  export type HTML = string & As<'HTML'>;
  /** A name to allow for matching two different `|uhtml|` messages. */
  export type UHTMLName = string & As<'UHTMLName'>;
  /** A string which should be parsed as JSON. */
  export type JSON = string & As<'JSON'>;

  /** The ID of a Room, may contains non-alphanumerics. */
  export type RoomID = string & As<'RoomID'>;
  /**
   * The title of the room. The title is _not_ guaranteed to resemble  the room ID; for instance,
   * room `battle-gen7uu-779767714` could have title `Alice vs. Bob`.
   */
  export type RoomTitle = string & As<'RoomTitle'>;
  /**
   * `USERLIST` is a comma-separated list of `USER`s, sent from chat rooms when they're joined.
   * Optionally, a `USER` can end in `@` followed by a user status message. A `STATUS` starting
   * in `!` indicates the user is away.
   */
  export type UserList = string & As<'UserList'>;

  /** A number encoded as a string. */
  export type Num = string & As<'Num'>;
  /**
   * A `|`-separated list of `FORMAT`s. `FORMAT` is a format name with one or more of these
   * suffixes: `,#` if the format uses random teams, `,,` if the format is only available for
   * searching, and `,` if the format is only available for challenging.
   *
   * Sections are separated by two vertical bars with the number of the column of that section
   * prefixed by `,` in it. After that follows the name of the section and another vertical bar.
   */
  export type FormatsList = string & As<'FormatsList'>;
  /**
   * Either `Elimination` or `Round Robin` and describes the type of bracket that will be used.
   * `Elimination` includes a prefix that denotes the number of times a player can lose before
   * being eliminated (`Single`, `Double`, etc.). `Round Robin` includes the prefix `Double` if
   * every matchup will battle twice.
   */
  export type Generator = string & As<'Generator'>;
  /**
   * An array of length 2 that denotes the number of Pokemon `USER1` had left and the number of
   * Pokemon `USER2` had left.
   */
  export type Score = string & As<'Score'>;
  /** The name of a metagame format. */
  export type FormatName = string & As<'FormatName'>;
  /** Rules affecting the battle, encoded as `RULE: DESCRIPTION`. */
  export type Rule = string & As<'Rule'>;
  export type BoostNames = string & As<'BoostNames'>;
  export type Side = string & As<'Side'>;
  export type Seed = string & As<'Seed'>;
  export type Slots = string & As<'Slots'>;
  export type Types = string & As<'Types'>;
  export type Nickname = string & As<'Nickname'>;
  export type StatDisplayName = string & As<'StatDisplayName'>;

  export type Reason = StatusName | 'partiallytrapped' | 'flinch' | 'nopp' | 'recharge';

  export type QueryType =
    'userdetails' | 'roomlist' | 'rooms' | 'laddertop' | 'roominfo' | 'savereplay';

  /** An unparsed JSON string containing `Challenges` information. */
  export type ChallengesJSON = string & As<'ChallengesJSON'>;
  /** An unparsed JSON string containing `SearchState` information. */
  export type SearchStateJSON = string & As<'SearchStateJSON'>;
  /** An unparsed JSON string containing `TournmanetUpdate` information. */
  export type TournamentUpdateJSON = string & As<'TournamentUpdateJSON'>;
  /** An unparsed JSON string containing `TournamentEnded` information. */
  export type TournamentEndedJSON = string & As<'TournamentEndedJSON'>;
  /** An unparsed JSON string containing `Request` information. */
  export type RequestJSON = string & As<'RequestJSON'>;

  /**
   * A JSON object representing the current state of who the user is challenging and who is
   * challenging the user. You'll get this whenever challenges update (when you challenge someone,
   * when you receive a challenge, when you or someone you challenged accepts/rejects/cancels a
   * challenge).
   *
   *   - `challengesFrom` will be a `{userid: format}` table of received challenges.
   *   - `challengeTo` will be a challenge if you're challenging someone, or `null` if you haven't.
   *
   * If you are challenging someone, `challengeTo` will be in the format:
   *
   *   `{"to":"player1","format":"gen7randombattle"}`.
   *
   * To challenge someone, send:
   *
   *    /utm TEAM
   *    /challenge USERNAME, FORMAT
   *
   * To cancel a challenge you made to someone, send:
   *
   *    /cancelchallenge USERNAME
   *
   * To reject a challenge you received from someone, send:
   *
   *    /reject USERNAME
   *
   * To accept a challenge you received from someone, send:
   *
   *    /utm TEAM
   *    /accept USERNAME
   *
   * Teams are in packed format. `TEAM` can also be `null`, if the format doesn't require user-built
   * teams, such as Random Battle.
   *
   * Invalid teams will send a `|popup|` with validation errors, and the `/accept` or `/challenge`
   * command won't take effect.
   *
   * If the challenge is accepted, you will receive a room initialization message.
   */
  export interface Challenges {
    searching: ID[];
    games: { [roomid in RoomID]: RoomTitle};
  }

  /**
   * A JSON object representing the current state of what battles the user is currently searching
   * for. You'll get this whenever searches update (when you search, cancel a search, or you start
   * or end a battle).
   *
   *   - `searching` will be an array of format IDs you're currently searching for games in.
   *   - `games` will be a `{roomid: title}` table of games you're currently in. Note that this
   *     includes ALL games, so `|updatesearch|` will be sent when you start/end challenge battles,
   *     and even non-Pokémon games like Mafia.
   *
   * To search for a battle against a random opponent, send:
   *
   *    /utm TEAM
   *    /search FORMAT
   *
   * Teams are in packed format. `TEAM` can also be `null`, if the format doesn't require
   * user-built teams, such as Random Battle.
   *
   * To cancel searching, send:
   *
   *    /cancelsearch
   */
  export interface SearchState {
    challengesFrom: { [userid in ID]: ID };
    challengeTo: null | { o: Username; format: ID };
  }

  /**
   * A JSON object representing the changes in the tournament since the last update you
   * received or the start of the tournament. These include:
   *
   *   - `format`: the tournament's custom name or the format being used
   *   - `teambuilderFormat`: the format being used; sent if a custom name was set
   *   - `isStarted`: whether or not the tournament has started
   *   - `isJoined`: whether or not you have joined the tournament
   *   - `generator`: the type of bracket being used by the tournament
   *   - `playerCap`: the player cap that was set or 0 if it was removed
   *   - `bracketData`: an object representing the current state of the bracket
   *   - `challenges`: a list of opponents that you can currently challenge
   *   - `challengeBys`: a list of opponents that can currently challenge you
   *   - `challenged`: the name of the opponent that has challenged you
   *   - `challenging`: the name of the opponent that you are challenging
   */
  export interface TournamentUpdate {
    format?: FormatName;
    teambuilderFormat?: FormatName;
    isStarted?: boolean;
    isJoined?: boolean;
    generator?: Generator;
    playerCap?: number;
    bracketData?: {[key: string]: any};
    challenges?: Username[];
    challengeBys?: Username[];
    challenged?: Username[];
    challenging?: Username[];
  }

  /**
   * A JSON object send when a tournament ends containing:
   *
   *   - `results`: the name(s) of the winner(s) of the tournament
   *   - `format`: the tournament's custom name or the format that was used
   *   - `generator`: the type of bracket that was used by the tournament
   *   - `bracketData`: an object representing the final state of the bracket
   */
  export interface TournamentEnded {
    results: Username[];
    format: FormatName;
    generator: Generator;
    bracketData: {[key: string]: any};
  }

  export interface Request {
    rqid?: number;
    active: Request.ActivePokemon[];
    side: {
      name: Username;
      id: Player;
      pokemon: Request.Pokemon[];
    };
    forceSwitch?: [true] & boolean[];
    wait?: boolean;
  }

  export namespace Request {
    export interface ActivePokemon {
      trapped?: boolean;
      maybeDisabled?: boolean;
      maybeTrapped?: boolean;
      canMegaEvo?: boolean;
      canUltraBoost?: boolean;
      canZMove?: null | Array<{
        move: MoveName;
        target: MoveTarget;
      }>;
      canDynamax?: boolean;
      maxMoves?: {
        maxMoves: Array<{
          move: ID;
          target: MoveTarget;
          disabled?: boolean;
        }>;
        gigantamax?: SpeciesName;
      };
      moves: Array<{
        move: MoveName;
        id: ID;
        pp: number;
        maxpp: number;
        target: MoveTarget;
        disabled: string | boolean;
      }>;
    }
    export interface Pokemon {
      active?: boolean;
      details: PokemonDetails;
      ident: PokemonIdent;
      pokeball: ID;
      ability: ID;
      baseAbility: ID;
      condition: PokemonCondition;
      item: ID;
      moves: ID[];
      stats: Omit<StatsTable, 'hp'>;
    }
  }

  export interface RoomInitArgs {
    /**
     * `|init|ROOMTYPE`
     *
     * The first message received from a room when you join it. `ROOMTYPE` is one of:
     * `chat` or `battle`
     */
    '|init|': readonly ['init', 'chat' | 'battle'];
    /**
     * `|title|TITLE`
     *
     * `TITLE` is the title of the room. The title is _not_ guaranteed to resemble
     * the room ID; for instance, room `battle-gen7uu-779767714` could have title `Alice vs. Bob`.
     */
    '|title|': readonly ['title', RoomTitle];
    /**
     * `|users|USERLIST`
     *
     * `USERLIST` is a comma-separated list of `USER`s, sent from chat rooms when they're joined.
     * Optionally, a `USER` can end in `@` followed by a user status message. A `STATUS` starting
     * in `!` indicates the user is away.
     */
    '|userlist|': readonly ['userlist', UserList];
  }

  export type RoomInitArgName = keyof RoomInitArgs;
  export type RoomInitArgType = RoomInitArgs[RoomInitArgName];

  export interface RoomMessageArgs {
    /**
     * `||MESSAGE` or `MESSAGE`
     *
     * We received a message `MESSAGE`, which should be displayed directly in the room's log.
     */
    '||': readonly ['', Message];
    /**
     * `|html|HTML`
     *
     * We received an HTML message, which should be sanitized and displayed directly in the
     * room's log.
     */
    '|html|': readonly ['html', HTML];
    /**
     * `|uhtml|NAME|HTML`
     *
     * We recieved an HTML message (NAME) that can change what it's displaying, this is used in
     * things like our Polls system, for example.
     */
    '|uhtml|': readonly ['uhtml', UHTMLName, HTML];
    /**
     * `|uhtmlchange|NAME|HTML`
     *
     * Changes the HTML display of the `|uhtml|` message named (NAME).
     */
    '|uhtmlchange|': readonly ['uhtmlchange', UHTMLName, HTML];
    /**
     * `|join|USER`, `|j|USER`, or `|J|USER`
     *
     * `USER` joined the room. Optionally, `USER` may be appended with `@!` to indicate that the
     * user is away or busy. The final boolean is true if the join was intended to be silent (`J`).
     */
    '|join|': readonly ['join', Username, boolean];
    /**
     * `|leave|USER`, `|l|USER`, or `|L|USER`
     *
     * `USER` left the room. The final boolean is true if the leave was intended to be silent (`L`).
     */
    '|leave|': readonly ['leave', Username, boolean];
    /**
     * `|name|USER|OLDID`, `|n|USER|OLDID`, or `|N|USER|OLDID`
     *
     * A user changed name to `USER`, and their previous userid was `OLDID`. Optionally, `USER` may
     * be appended with `@!` to indicate that the user is away or busy. The final boolean is true if
     * the name change was intended to be silent (`N`).
     */
    '|name|': readonly ['name', Username, ID, boolean];
    /**
     * `|chat|USER|MESSAGE` or `|c|USER|MESSAGE`
     *
     * `USER` said `MESSAGE`. Note that `MESSAGE` can contain `|` characters.
     */
    '|chat|': readonly ['chat', Username, Message];
    /**
     * `|:|TIMESTAMP`
     *
     * `:` is the current time according to the server, so that times can be adjusted and reported
     * in the local time in the case of a discrepancy.
     *
     * The exact fate of this command is uncertain - it may or may not be replaced with a more
     * generalized way to transmit timestamps at some point.
     */
    '|:|': readonly [':', Timestamp];
    /**
     * `|c:|TIMESTAMP|USER|MESSAGE`
     *
     * `c:` is pretty much the same as `c`, but also comes with a UNIX timestamp; (the number of
     * seconds since 1970). This is used for accurate timestamps in chat logs.
     */
    '|c:|': ['c:', Timestamp, Username, Message];
    /**
     * `|battle|ROOMID|USER1|USER2` or `|b|ROOMID|USER1|USER2`
     *
     * A battle started between `USER1` and `USER2`, and the battle room has ID `ROOMID`.
     */
    '|battle|': readonly ['battle', RoomID, Username, Username];
  }

  export type RoomMessageArgName = keyof RoomMessageArgs;
  export type RoomMessageArgType = RoomMessageArgs[RoomMessageArgName];

  export type RoomArgs = RoomInitArgs & RoomMessageArgs;
  export type RoomArgName = RoomInitArgName | RoomMessageArgName;
  export type RoomArgsType = RoomArgs[RoomArgName];

  export interface GlobalArgs {
    /**
     * `|popup|MESSAGE`
     *
     * Show the user a popup containing `MESSAGE`. `||` denotes a newline in the popup.
     */
    '|popup|': readonly ['popup', Message];
    /**
     * `|pm|SENDER|RECEIVER|MESSAGE`
     *
     * A PM was sent from `SENDER` to `RECEIVER` containing the message `MESSAGE`.
     */
    '|pm|': readonly ['pm', Username, Username, Message];
    /**
     * `|usercount|USERCOUNT`
     *
     * `USERCOUNT` is the number of users on the server.
     */
    '|usercount|': readonly ['usercount', Num];
    /**
     * `|nametaken|USERNAME|MESSAGE`
     *
     * You tried to change your username to `USERNAME` but it failed for the reason described in
     * `MESSAGE`.
     */
    '|nametaken|': readonly ['nametaken', Username, Message];
    /**
     * `|challstr|CHALLSTR`
     *
     * You just connected to the server, and we're giving you some information you'll need to log
     * in.
     *
     * If you're already logged in and have session cookies, you can make an HTTP GET request to
     * `http://play.pokemonshowdown.com/action.php?act=upkeep&challstr=CHALLSTR`
     *
     * Otherwise, you'll need to make an HTTP POST request to
     * `http://play.pokemonshowdown.com/action.php` with the data
     * `act=login&name=USERNAME&pass=PASSWORD&challstr=CHALLSTR`
     *
     * `USERNAME` is your username and `PASSWORD` is your password, and `CHALLSTR` is the value you
     * got from `|challstr|`. Note that `CHALLSTR` contains `|` characters. (Also feel free to make
     * the request to `https://` if your client supports it.)
     *
     * Either way, the response will start with `]` and be followed by a JSON object which we'll
     * call `data`.
     *
     * Finish logging in (or renaming) by sending: `/trn USERNAME,0,ASSERTION` where `USERNAME` is
     * your desired username and `ASSERTION` is `data.assertion`.
     */
    '|challstr|': readonly ['challstr', '4', string];
    /**
     * `|updateuser|USER|NAMED|AVATAR|SETTINGS`
     *
     * Your name, avatar or settings were successfully changed. Your rank and username are now
     * `USER`. Optionally, `USER` may be appended with `@!` to indicate that you are away or busy.
     * `NAMED` will be `0` if you are a guest or `1` otherwise. Your avatar is now `AVATAR`.
     * `SETTINGS` is a JSON object representing the current state of various user settings.
     */
    '|updateuser|': readonly ['updateuser', Username, '0' | '1', AvatarIdent, JSON];
    /**
     * `|formats|FORMATSLIST`
     *
     * This server supports the formats specified in `FORMATSLIST`. `FORMATSLIST` is a `|`-separated
     * list of `FORMAT`s. `FORMAT` is a format name with one or more of these suffixes: `,#` if the
     * format uses random teams, `,,` if the format is only available for searching, and `,` if the
     * format is only available for challenging.
     *
     * Sections are separated by two vertical bars with the number of the column of that section
     * prefixed by `,` in it. After that follows the name of the section and another vertical bar.
     */
    '|formats|': readonly ['formats', FormatsList];
    /**
     * `|updatesearch|JSON`
     *
     * `JSON` is a JSON object representing the current state of what battles the user is currently
     * searching for. You'll get this whenever searches update (when you search, cancel a search,
     * or you start or end a battle).
     */
    '|updatesearch|': readonly ['updatesearch', SearchStateJSON];
    /**
     * `|updatechallenges|JSON`
     *
     * `JSON` is a JSON object representing the current state of who the user is challenging and
     * who is challenging the user. You'll get this whenever challenges update (when you challenge
     * someone, when you receive a challenge, when you or someone you challenged
     * accepts/rejects/cancels a challenge).
     */
    '|updatechallenges|': readonly ['updatechallenges', ChallengesJSON];
    /**
     * `|queryresponse|QUERYTYPE|JSON`
     *
     * `JSON` is a JSON object representing containing the data that was requested with
     * `/query QUERYTYPE` or `/query QUERYTYPE DETAILS`.
     *
     * Possible queries include `/query roomlist` and `/query userdetails USERNAME`.
     */
    '|queryresponse|': readonly ['queryresponse', QueryType, JSON];
  }

  export type GlobalArgName = keyof GlobalArgs;
  export type GlobalArgType = GlobalArgs[GlobalArgName];

  export interface MiscArgs {
    '|unlink|': readonly ['unlink', Username] | readonly ['unlink', 'hide', Username];
    '|raw|': readonly ['raw', HTML];
    '|warning|': readonly ['warning', Message];
    '|error|': readonly ['error', Message];
    '|bigerror|': readonly ['bigerror', Message];
    '|chatmsg|': readonly ['chatmsg', Message];
    '|chatmsg-raw|': readonly ['chatmsg-raw', HTML];
    '|controlshtml|': readonly ['controlshtml', HTML];
    '|fieldhtml|': readonly ['fieldhtml', HTML];
    '|debug|': readonly ['debug', Message];
  }

  export interface TournamentArgs {
    /**
     * `|tournament|create|FORMAT|GENERATOR|PLAYERCAP`
     *
     * `FORMAT` is the name of the format in which each battle will be played. `GENERATOR` is either
     * `Elimination` or `Round Robin` and describes the type of bracket that will be used.
     * `Elimination` includes a prefix that denotes the number of times a player can lose before
     * being eliminated (`Single`, `Double`, etc.). `Round Robin` includes the prefix `Double` if
     * every matchup will battle twice. `PLAYERCAP` is a number representing the maximum amount of
     * players that can join the tournament or `0` if no cap was specified.
     */
    '|tournament|create|': readonly ['tournament', 'create', Generator, '0' | Num];
    /**
     * `|tournament|update|JSON`
     *
     * `JSON` is a JSON object representing the changes in the tournament since the last update you
     * received or the start of the tournament.
     */
    '|tournament|update|': readonly ['tournament', 'update', TournamentUpdateJSON];
    /**
     * `|tournament|updateEnd`
     *
     * Signals the end of an update period.
     */
    '|tournament|updateEnd|': readonly ['tournament', 'updateEnd'];
    /**
     * `|tournament|error|ERROR`
     *
     * An error of type `ERROR` occurred.
     */
    '|tournament|error|': readonly ['tournament', 'error', Message];
    /**
     * `|tournament|forceend`
     *
     * The tournament was forcibly ended.
     */
    '|tournament|forceend|': readonly ['tournament', 'forceend'];
    /**
     * `|tournament|join|USER`
     *
     * `USER` joined the tournament.
     */
    '|tournament|join|': readonly ['tournament', 'join', Username];
    /**
     * `|tournament|leave|USER`
     *
     * `USER` left the tournament.
     */
    '|tournament|leave|': readonly ['tournament', 'leave', Username];
    /**
     * `|tournament|replace|OLD|NEW`
     *
     * The player `OLD` has been replaced with `NEW`
     */
    '|tournament|replace|': readonly ['tournament', 'replace', Username, Username];
    /**
     * `|tournament|start|NUMPLAYERS`
     *
     * The tournament started with `NUMPLAYERS` participants.
     */
    '|tournament|start|': readonly ['tournament', 'start', Num];
    /**
     * `|tournament|disqualify|USER`
     *
     * `USER` was disqualified from the tournament.
    */
    '|tournament|disqualify|': readonly ['tournament', 'disqualify', Username];
    /**
     * `|tournament|battlestart|USER1|USER2|ROOMID`
     *
     * A tournament battle started between `USER1` and `USER2`, and the battle room has ID `ROOMID`.
     */
    '|tournament|battlestart|': readonly ['tournament', 'battlestart', Username, Username, RoomID];
    /**
     * `|tournament|battleend|USER1|USER2|RESULT|SCORE|RECORDED|ROOMID`
     *
     * The tournament battle between `USER1` and `USER2` in the battle room `ROOMID` ended. `RESULT`
     * describes the outcome of the battle from `USER1`'s perspective (`win`, `loss`, or `draw`).
     * `SCORE` is an array of length 2 that denotes the number of Pokemon `USER1` had left and the
     * number of Pokemon `USER2` had left. `RECORDED` will be `fail` if the battle ended in a draw
     * and the bracket type does not support draws. Otherwise, it will be `success`.
     */
    '|tournament|battleend|':
    | readonly [
      'tournament', 'battleend', Username, Username, 'win' | 'loss' | 'draw', Score, 'success'
    ] | readonly ['tournament', 'battleend', Username, Username, 'draw', Score, 'fail'];
    /**
     * `|tournament|end|JSON`
     *
     * The tournament ended with details in `JSON`.
     */
    '|tournament|end|': readonly ['tournament', 'end', TournamentEndedJSON];
    /**
     * `|tournament|scouting|SETTING`
     *
     * Players are now either allowed or not allowed to join other tournament battles based on
     * `SETTING` (`allow` or `disallow`).
     */
    '|tournament|scouting|': readonly ['tournament', 'scouting', 'allow' | 'disallow'];
    /**
     * `|tournament|autostart|on|TIMEOUT`
     * `|tournament|autostart|off`
     *
     * If the third parameter is 'on': a timer was set for the tournament to auto-start in
     * `TIMEOUT` seconds. If the third parameter is 'off': the timer for the tournament to
     * auto-start was turned off.
     */
    '|tournament|autostart|':
    | readonly ['tournament', 'autostart', 'on', Num]
    | readonly ['tournament', 'autostart', 'off'];
    /**
     * `|tournament|autodq|on|TIMEOUT`
     * `|tournament|autodq|off`
     * `|tournament|autodq|target|TIME`
     *
     * If the third parameter is 'on': a timer was set for the tournament to auto-disqualify
     * inactive players every `TIMEOUT` seconds. If the third parameter is 'off': the timer for the
     * tournament to auto-disqualify inactive players was turned off. If the third parameter is
     * 'target': you have `TIME` seconds to make or accept a challenge, or else you will be
     * disqualified for inactivity.
     */
    '|tournament|autodq|':
    | readonly ['tournament', 'autodq', 'on', Num]
    | readonly ['tournament', 'autodq', 'off']
    | readonly ['tournament', 'autodq', 'target', Num];
  }

  export type TournamentArgName = keyof TournamentArgs;
  export type TournamentArgType = TournamentArgs[TournamentArgName];

  export type MiscArgName = keyof MiscArgs;
  export type MiscArgType = MiscArgs[MiscArgName];

  export interface BattleInitArgs {
    /**
     * `|player|PLAYER|USERNAME|AVATAR|RATING`
     *
     *   - `PLAYER` is `p1` or `p2` (may also be `p3` or `p4` in 4 player battles)
     *   - `USERNAME` is the username
     *   - `AVATAR` is the player's avatar identifier
     *   - `RATING` is the player's Elo rating in the format they're playing. This will only be
     *     displayed in rated battles and when the player is first introduced otherwise it's blank.
     */
    '|player|': readonly ['player', Player, Username, AvatarIdent, Num?] |readonly ['player', Player];
    /**
     * `|teamsize|PLAYER|NUMBER`
     *
     *   - `PLAYER` is `p1`, `p2`, `p3`, or `p4`
     *   - `NUMBER` is the number of Pokémon your opponent starts with. In games without Team
     *     Preview, you don't know which Pokémon your opponent has, but you at least know how many
     *     there are.
     */
    '|teamsize|': readonly ['teamsize', Player, Num];
    /**
     * `|gametype|GAMETYPE`
     *
     * - `GAMETYPE` is `singles`, `doubles`, `triples`, `multi`, `free-for-all` or `rotation`.
     */
    '|gametype|': readonly ['gametype', GameType];
    /**
     * `|gen|GENNUM`
     *
     * Generation number, from 1 to 8. Stadium counts as its respective gens;,Let's Go counts as 7,
     * and modded formats count as whatever gen they were based on.
     */
    '|gen|': readonly ['gen', GenerationNum];
    /**
     * `|tier|FORMATNAME`
     *
     * The name of the format being played.
     */
    '|tier|': readonly ['tier', FormatName];
    /**
     * `|rated`
     * `|rated|MESSAGE`
     *
     * Will be sent if the game will affect the player's ladder rating (Elo score). `MESSAGE` will
     * be included if the game is official in some other way, such as being a tournament game. Does
     * not actually mean the game is rated.
     */
    '|rated|': readonly ['rated'] | readonly ['rated', Message];
    '|seed|': readonly ['seed', Seed];
    /**
     * `|rule|RULE: DESCRIPTION`
     *
     * Will appear multiple times, one for each rule in effect.
     */
    '|rule|': readonly ['rule', Rule];
    /**
     * `|clearpoke`
     *
     * Marks the start of Team Preview
     */
    '|clearpoke|': readonly ['clearpoke'];
    /**
     * `|poke|PLAYER|DETAILS|ITEM`
     *
     * Declares a Pokémon for Team Preview.
     *
     *   - `PLAYER` is the player ID (see `|player|`)
     *   - `DETAILS` describes the pokemon
     *   - `ITEM` will be `item` if the Pokémon is holding an item, or blank if it isn't.
     *
     * Note that forme and shininess are hidden on this, unlike on the `|switch|`details message.
     */
    '|poke|': readonly ['player', Player, PokemonDetails, 'item' | ''];
    /**
     * `|teampreview`
     *
     * Marks the end of Team Preview
     */
    '|teampreview|': readonly ['teampreview'] | ['teampreview', Num];
    /**
     * `|start`
     *
     * Indicates that the game has started.
     */
    '|start|': readonly ['start'];
  }

  export type BattleInitArgName = keyof BattleInitArgs;
  export type BattleInitArgType = BattleInitArgs[BattleInitArgName];

  export interface BattleProgressArgs {
    /**
     * `|`
     *
     * Clears the message-bar, and add a spacer to the battle history. This is usually done
     * automatically by detecting the message-type, but can also be forced to happen with this.
     */
    '|done|': readonly ['done'];
    /**
     * `|request|REQUEST`
     *
     * Gives a JSON object containing a request for a choice (to move or switch). To assist in your
     * decision, `REQUEST.active` has information about your active Pokémon, and `REQUEST.side` has
     * information about your, your team as a whole. `REQUEST.rqid` is an optional request ID.
     */
    '|request|': readonly ['request', RequestJSON];
    /**
     * `|inactive|MESSAGE`
     *
     * A message related to the battle timer has been sent. The official client displays these
     * messages in red. `inactive` means that the timer is on at the time the message was sent.
     */
    '|inactive|': readonly ['inactive', Message];
    /**
     * `|inactiveoff|MESSAGE`
     *
     * A message related to the battle timer has been sent. The official client displays these
     * messages in red. `inactiveoff` means that the timer is off.
     */
    '|inactiveoff|': readonly ['inactiveoff', Message];
    /**
     * `|upkeep`
     *
     * Signals the upkeep phase of the turn where the number of turns left for field
     * conditions are updated.
     */
    '|upkeep|': readonly ['upkeep'];
    /**
     * `|turn|NUMBER`
     *
     * It is now turn `NUMBER`.
     */
    '|turn|': readonly ['turn', Num];
    /**
     * `|win|USER`
     *
     * `USER` has won the battle.
     */
    '|win|': readonly ['win', Username];
    /**
     * `|tie`
     *
     * The battle has ended in a tie.
     */
    '|tie|': readonly ['tie'];
  }

  export type BattleProgressArgName = keyof BattleProgressArgs;
  export type BattleProgressArgType = BattleProgressArgs[BattleProgressArgName];

  export interface BattleMajorArgs {
    /**
     * `|move|POKEMON|MOVE|TARGET`
     *
     * The specified Pokémon has used move `MOVE` at `TARGET`. If a move has multiple targets or
     * no target, `TARGET` should be ignored. If a move targets a side, `TARGET` will be a (possibly
     * fainted) Pokémon on that side.
     */
    '|move|':
    | readonly ['move', PokemonIdent, MoveName, PokemonIdent]
    | readonly ['move', PokemonIdent, MoveName];
    /**
     * `|switch|POKEMON|DETAILS|HP STATUS`
     *
     * A Pokémon identified by `POKEMON` has switched in (if there was an old Pokémon in that
     * position, it is switched out).
     *
     * `POKEMON|DETAILS` represents all the information that can be used to tell Pokémon apart. If
     * two pokemon have the same `POKEMON|DETAILS` (which will never happen in any format with
     * Species Clause), you usually won't be able to tell if the same pokemon switched in or a
     * different pokemon switched in.
     *
     * The switched Pokémon has HP `HP`, and status `STATUS`. `HP` is specified as a fraction; if it
     * is your own Pokémon then it will be `CURRENT/MAX`, if not, it will be `/100` if HP Percentage
     * Mod is in effect and `/48` otherwise. `STATUS` can be left blank, or it can be `slp`, `par`,
     * etc.
     */
    '|switch|': readonly ['switch', PokemonIdent, PokemonDetails, PokemonHPStatus];
    /**
     * `|drag|POKEMON|DETAILS|HP STATUS`
     *
     * As `|switch|`, but `switch` means it was intentional, while `drag` means it was unintentional
     * (forced by Whirlwind, Roar, etc).
     */
    '|drag|': readonly ['drag', PokemonIdent, PokemonDetails, PokemonHPStatus];
    /**
     * `|detailschange|POKEMON|DETAILS|HP STATUS`
     *
     * The specified Pokémon has changed formes (via Mega Evolution, ability, etc.) to `DETAILS`. If
     * the forme change is permanent (Mega Evolution or a Shaymin-Sky that is frozen), then
     * `|detailschange|` will appear; otherwise, the client will send `|-formechange|`.
     *
     * Syntax is the same as `|switch|`.
     */
    '|detailschange|': readonly ['detailschange', PokemonIdent, PokemonDetails, PokemonHPStatus];
    /**
     * `|replace|POKEMON|DETAILS|HP STATUS`
     *
     * Illusion has ended for the specified Pokémon. Syntax is the same as `|switch|`, but remember
     * that everything you thought you knew about the previous Pokémon is now wrong.
     *
     * `POKEMON` will be the NEW Pokémon ID - i.e. it will have the nickname of the Zoroark (or
     * other Illusion user).
     */
    '|replace|': readonly ['replace', PokemonIdent, PokemonDetails, PokemonHPStatus];
    /**
     * `|swap|POKEMON|POSITION`
     *
     * Moves already active `POKEMON` to active field `POSITION` where the leftmost position is 0
     * and each position to the right counts up by 1.
     */
    '|swap|': readonly ['swap', PokemonIdent, Num] | readonly ['swap', PokemonIdent];
    /**
     * `|cant|POKEMON|REASON` or `|cant|POKEMON|REASON|MOVE`
     *
     * The Pokémon `POKEMON` could not perform a move because of the indicated `REASON` (such as
     * paralysis, Disable, etc). Sometimes, the move it was trying to use is given.
     */
    '|cant|': readonly ['cant', PokemonIdent, Reason | AbilityName | EffectName | MoveName, EffectName | MoveName];
    /**
     * `|faint|POKEMON`
     *
     * The Pokémon `POKEMON` has fainted.
     */
    '|faint|': readonly ['faint', PokemonIdent];
    '|switchout|': readonly ['switchout', PokemonIdent];
    '|message|': readonly ['message', Message];
  }

  export type BattleMajorArgName = keyof BattleMajorArgs;
  export type BattleMajorArgType = BattleMajorArgs[BattleMajorArgName];

  export interface BattleMinorArgs {
    /**
     * `|-formechange|POKEMON|SPECIES|HP STATUS`
     *
     * The specified Pokémon has changed formes (via Mega Evolution, ability, etc.) to `SPECIES`. If
     * the forme change is permanent (Mega Evolution or a Shaymin-Sky that is frozen), then
     * `|detailschange|` will appear; otherwise, the client will send `|-formechange|`.
     *
     * Syntax is the same as `|switch|`, though with `SPECIES` in lieu of `DETAILS`.
     */
    '|-formechange|': readonly ['-formechange', PokemonIdent, SpeciesName, PokemonHPStatus];
    '|-fail|':
    | readonly ['-fail', PokemonIdent, MoveName]
    | readonly ['-fail', PokemonIdent]
    | readonly ['-fail', PokemonIdent, 'unboost', StatDisplayName];
    '|-block|': readonly ['-block', PokemonIdent, EffectName, MoveName, PokemonIdent?];
    '|-notarget|': readonly ['-notarget', PokemonIdent] | readonly ['-notarget'];
    '|-miss|': readonly ['-miss', PokemonIdent, PokemonIdent] | readonly ['-miss', PokemonIdent];
    '|-damage|': readonly ['-damage', PokemonIdent, PokemonHPStatus];
    '|-heal|': readonly ['-heal', PokemonIdent, PokemonHPStatus];
    '|-sethp|':
    | readonly ['-sethp', PokemonIdent, Num]
    | readonly ['-sethp', PokemonIdent, Num, PokemonIdent, Num];
    '|-status|': readonly ['-status', PokemonIdent, StatusName | 'tox'];
    '|-curestatus|': readonly ['-curestatus', PokemonIdent, StatusName | 'tox'];
    '|-cureteam|': readonly ['-cureteam', PokemonIdent];
    '|-boost|': readonly ['-boost', PokemonIdent, BoostName, Num];
    '|-unboost|': readonly ['-unboost', PokemonIdent, BoostName, Num];
    '|-setboost|': readonly ['-setboost', PokemonIdent, BoostName, Num];
    '|-swapboost|': readonly ['-swapboost', PokemonIdent, PokemonIdent, BoostNames];
    '|-invertboost|': readonly ['-invertboost', PokemonIdent];
    '|-clearboost|': readonly ['-clearboost', PokemonIdent];
    '|-clearallboost|': readonly ['-clearallboost'];
    '|-clearpositiveboost|': readonly ['-clearpositiveboost', PokemonIdent, PokemonIdent, EffectName];
    '|-clearnegativeboost|': readonly ['-clearnegativeboost', PokemonIdent];
    '|-copyboost|':
    | readonly ['-copyboost', PokemonIdent, PokemonIdent]
    | readonly ['-copyboost', PokemonIdent, PokemonIdent, BoostNames];
    '|-weather|': readonly ['-weather', Weather | 'none'];
    '|-fieldstart|': readonly ['-fieldstart', FieldCondition];
    '|-fieldend|': readonly ['-fieldend', FieldCondition];
    '|-sidestart|': readonly ['-sidestart', Side, SideCondition];
    '|-sideend|': readonly ['-sideend', Side, SideCondition];
    '|-start|':
    | readonly ['-start', PokemonIdent, EffectName]
    | readonly ['-start', PokemonIdent, EffectName, Types]
    | readonly ['-start', PokemonIdent, EffectName, MoveName];
    '|-end|': readonly ['-end', PokemonIdent, EffectName];
    '|-crit|': readonly ['-crit', PokemonIdent];
    '|-supereffective|': readonly ['-supereffective', PokemonIdent];
    '|-resisted|': readonly ['-resisted', PokemonIdent];
    '|-immune|': readonly ['-immune', PokemonIdent];
    '|-item|': readonly ['-item', PokemonIdent, ItemName];
    '|-enditem|': readonly ['-enditem', PokemonIdent, ItemName];
    '|-ability|':
    | readonly ['-ability', PokemonIdent, AbilityName]
    | readonly ['-ability', PokemonIdent, AbilityName, PokemonIdent | 'boost']
    | readonly ['-ability', PokemonIdent, AbilityName, AbilityName, PokemonIdent];
    '|-endability|':
    | readonly ['-endability', PokemonIdent]
    | readonly ['-endability', PokemonIdent, AbilityName];
    '|-transform|': readonly ['-transform', PokemonIdent, SpeciesName];
    '|-mega|': readonly ['-mega', PokemonIdent, SpeciesName, ItemName];
    '|-primal|': readonly ['-primal', PokemonIdent];
    '|-burst|': readonly ['-burst', PokemonIdent, SpeciesName, ItemName];
    '|-zpower|': readonly ['-zpower', PokemonIdent];
    '|-zbroken|': readonly ['-zbroken', PokemonIdent];
    '|-activate|': readonly [
      '-activate',
      PokemonIdent,
      AbilityName | EffectName,
      (ItemName | MoveName | Num | PokemonIdent)?,
      (AbilityName | Num)?
    ] | readonly ['-activate', PokemonIdent, EffectName, PokemonIdent];
    '|-fieldactivate|': readonly ['-fieldactivate', EffectName];
    '|-hint|': readonly ['-hint', Message];
    '|-center|': readonly ['-center'];
    '|-message|': readonly ['-message', Message];
    '|-combine|': readonly ['-combine'];
    '|-waiting|': readonly ['-waiting', PokemonIdent, PokemonIdent];
    '|-prepare|': readonly ['-prepare', PokemonIdent, MoveName, PokemonIdent];
    '|-mustrecharge|': readonly ['-mustrecharge', PokemonIdent];
    '|-hitcount|': readonly ['-hitcount', PokemonIdent, Num];
    '|-singlemove|': readonly ['-singlemove', PokemonIdent, MoveName];
    '|-singleturn|': readonly ['-singleturn', PokemonIdent, MoveName];
    '|-anim|': readonly ['-anim', PokemonIdent, MoveName, PokemonIdent];
    '|-ohko|': readonly ['-ohko'];
  }

  export type BattleMinorArgName = keyof BattleMinorArgs;
  export type BattleMinorArgType = BattleMinorArgs[BattleMinorArgName];

  export type BattleArgs =
    BattleInitArgs &
    BattleProgressArgs &
    BattleMajorArgs &
    BattleMinorArgs;
  export type BattleArgName =
    | BattleInitArgName
    | BattleProgressArgName
    | BattleMajorArgName
    | BattleMinorArgName;
  export type BattleArgType = BattleArgs[BattleArgName];

  export type BattleArgsKWArgsTypes = {
    'ability': AbilityName;
    'ability2': AbilityName;
    /**
     * `[anim] MOVE2`
     *
     * Use the animation of `MOVE2` instead.
     */
    'anim': MoveName;
    'block': MoveName;
    'broken': true;
    'consumed': true;
    'damage': true;
    'eat': true;
    'fail': true;
    'fatigue': true;
    'forme': true;
    /** `[from] EFFECT` */
    'from': EffectName;
    'heavy': true;
    'item': ItemName;
    /**
     * `[miss]`
     *
     * The move missed.
     */
    'miss': true;
    'move': MoveName;
    'msg': true;
    'name': PokemonIdent;
    'notarget': true;
    'number': Num;
    /** `[of] SOURCE` */
    'of': PokemonIdent;
    'ohko': true;
    /**
     * `[silent]`
     *
     * Suppress message.
     */
    'silent': true;
    'spread': Slots;
    /**
     * `[still]`
     *
     * Suppress animation.
     */
    'still': true;
    'thaw': true;
    'upkeep': true;
    'weak': true;
    'weaken': true;
    'wisher': Nickname;
    'zeffect': true;
  } & {
    'already': true;
    'anim': 'prepare';
    'identify': true;
    'interrupt': true;
    'multiple': true;
    'partiallytrapped': true;
    'prepare': true;
  };

  export type GeneralKWArgNames = 'from' | 'of' | 'still' | 'silent';

  export interface BattleArgsWithKWArgs {
    '|cant|': GeneralKWArgNames;
    '|detailschange|': GeneralKWArgNames | 'msg';
    '|move|': GeneralKWArgNames | 'anim' | 'miss' | 'notarget' | 'prepare' | 'spread' | 'zeffect';
    '|swap|': GeneralKWArgNames;
    '|switchout|': GeneralKWArgNames;
    '|-activate|': GeneralKWArgNames
    | 'ability' | 'ability2' | 'block' | 'broken' | 'damage'
    | 'item' | 'move' | 'number'| 'consumed' | 'name';
    '|-ability|': GeneralKWArgNames | 'move' | 'weaken' | 'fail';
    '|-block|': GeneralKWArgNames;
    '|-boost|': GeneralKWArgNames | 'multiple' | 'zeffect';
    '|-copyboost|': GeneralKWArgNames | 'zeffect';
    '|-clearboost|': GeneralKWArgNames | 'zeffect';
    '|-clearallboost|': GeneralKWArgNames | 'zeffect';
    '|-clearpositiveboost|': GeneralKWArgNames | 'zeffect';
    '|-clearnegativeboost|': GeneralKWArgNames | 'zeffect';
    '|-crit|': 'spread';
    '|-curestatus|': GeneralKWArgNames| 'thaw' | 'msg';
    '|-cureteam|': GeneralKWArgNames;
    '|-damage|': GeneralKWArgNames | 'partiallytrapped';
    '|-end|': GeneralKWArgNames | 'partiallytrapped' | 'interrupt';
    '|-endability|': GeneralKWArgNames;
    '|-enditem|': GeneralKWArgNames | 'eat' | 'move' |'weaken';
    '|-fail|': GeneralKWArgNames | 'forme' | 'heavy' | 'msg' | 'weak' | 'fail';
    '|-fieldactivate|': GeneralKWArgNames;
    '|-fieldstart|': GeneralKWArgNames;
    '|-fieldend|': GeneralKWArgNames;
    '|-formechange|': GeneralKWArgNames | 'msg';
    '|-heal|': GeneralKWArgNames | 'wisher' | 'zeffect';
    '|-immune|': GeneralKWArgNames | 'ohko';
    '|-invertboost|': GeneralKWArgNames;
    '|-item|': GeneralKWArgNames | 'identify';
    '|-miss|': GeneralKWArgNames;
    '|-resisted|': 'spread';
    '|-setboost|': GeneralKWArgNames;
    '|-sethp|': GeneralKWArgNames;
    '|-sideend|': GeneralKWArgNames;
    '|-singlemove|': GeneralKWArgNames | 'zeffect';
    '|-singleturn|': GeneralKWArgNames | 'zeffect';
    '|-start|': GeneralKWArgNames
    | 'already' | 'damage' | 'block' | 'fatigue' | 'upkeep' | 'zeffect';
    '|-status|': GeneralKWArgNames;
    '|-supereffective|': 'spread';
    '|-swapboost|': GeneralKWArgNames;
    '|-transform|': GeneralKWArgNames | 'msg';
    '|-unboost|': GeneralKWArgNames | 'multiple' | 'zeffect';
    '|-weather|': GeneralKWArgNames | 'upkeep';
  }

  export type BattleArgsWithKWArgName = keyof BattleArgsWithKWArgs;
  export type BattleArgsWithKWArgType = BattleArgsWithKWArgs[BattleArgsWithKWArgName];

  export type BattleArgKWArgs<T extends BattleArgName> = Readonly<
  T extends BattleArgsWithKWArgName
    ? { [K in BattleArgsWithKWArgs[T]]?: BattleArgsKWArgsTypes[K] }
    : {}>;

  export type BattleArgsKWArgs = { [T in BattleArgName]: BattleArgKWArgs<T> };
  export type BattleArgsKWArgName = BattleArgName;
  export type BattleArgsKWArgType = BattleArgsKWArgs[Protocol.BattleArgsWithKWArgName];

  export type Args = Readonly<
  RoomArgs &
  GlobalArgs &
  TournamentArgs &
  MiscArgs &
  BattleArgs>;
  export type ArgName =
    | RoomArgName
    | GlobalArgName
    | TournamentArgName
    | MiscArgName
    | BattleArgName;

  export type ArgType = Args[ArgName];

  export type KWArgs = BattleArgsKWArgs;
  export type KWArgType = BattleArgsKWArgType;

  export type ArgsWithKWArgName = BattleArgsWithKWArgName;
  export type ArgsWithKWArgType = BattleArgsKWArgType;

  export type Handler<T = void | Promise<void>> = {
    [key in Exclude<ArgName, ArgsWithKWArgName>]?: (m: Args[key]) => T;
  } & {
    [key in ArgsWithKWArgName]?: (a: Args[key], k: KWArgs[key]) => T;
  };
}

export type PositionLetter = Protocol.PositionLetter;

export type PokemonIdent = Protocol.PokemonIdent;
export type PokemonSearchID = Protocol.PokemonSearchID;
export type PokemonDetails = Protocol.PokemonDetails;
export type PokemonCondition = Protocol.PokemonCondition;
export type PokemonHPStatus = Protocol.PokemonHPStatus;

export type Username = Protocol.Username;
export type AvatarIdent = Protocol.AvatarIdent;

export type EffectName = Protocol.EffectName;
export type SpeciesName = Protocol.SpeciesName;
export type AbilityName = Protocol.AbilityName;
export type ItemName = Protocol.ItemName;
export type MoveName = Protocol.MoveName;

export type Message = Protocol.Message;
export type Timestamp = Protocol.Timestamp;

export type HTML = Protocol.HTML;
export type UHTMLName = Protocol.UHTMLName;
export type JSON = Protocol.JSON;

export type RoomID = Protocol.RoomID;
export type RoomTitle = Protocol.RoomTitle;
export type UserList = Protocol.UserList;

export type Num = Protocol.Num;
export type FormatsList = Protocol.FormatsList;
export type Score = Protocol.Score;
export type Generator = Protocol.Generator;
export type FormatName = Protocol.FormatName;
export type Rule = Protocol.Rule;
export type BoostNames = Protocol.BoostNames;
export type Side = Protocol.Side;
export type Seed = Protocol.Seed;
export type Slots = Protocol.Slots;
export type Types = Protocol.Types;
export type Nickname = Protocol.Nickname;
export type StatDisplayName = Protocol.StatDisplayName;

export type Reason = Protocol.Reason;
export type QueryType = Protocol.QueryType;

export type ChallengesJSON = Protocol.ChallengesJSON;
export type SearchStateJSON = Protocol.SearchStateJSON;
export type TournamentUpdateJSON = Protocol.TournamentUpdateJSON;
export type TournamentEndedJSON = Protocol.TournamentEndedJSON;
export type RequestJSON = Protocol.RequestJSON;

export type Challenges = Protocol.Challenges;
export type SearchState = Protocol.SearchState;
export type TournamentUpdate = Protocol.TournamentUpdate;
export type TournamentEnded = Protocol.TournamentEnded;

export type Request = Protocol.Request;
export namespace Request {
  export type ActivePokemon = Protocol.Request.ActivePokemon;
  export type Pokemon = Protocol.Request.Pokemon;
}

export type RoomInitArgs = Protocol.RoomInitArgs;
export type RoomInitArgName = Protocol.RoomInitArgName;
export type RoomInitArgType = Protocol.RoomInitArgType;

export type RoomMessageArgs = Protocol.RoomMessageArgs;
export type RoomMessageArgName = Protocol.RoomMessageArgName;
export type RoomMessageArgType = Protocol.RoomMessageArgType;

export type RoomArgs = Protocol.RoomArgs;
export type RoomArgName = Protocol.RoomArgName;
export type RoomArgsType = Protocol.RoomArgsType;

export type GlobalArgs = Protocol.GlobalArgs;
export type GlobalArgName = Protocol.GlobalArgName;
export type GlobalArgType = Protocol.GlobalArgType;

export type MiscArgs = Protocol.MiscArgs;
export type MiscArgName = Protocol.MiscArgName;
export type MiscArgType = Protocol.MiscArgType;

export type TournamentArgs = Protocol.TournamentArgs;
export type TournamentArgName = Protocol.TournamentArgName;
export type TournamentArgType = Protocol.TournamentArgType;

export type BattleInitArgs = Protocol.BattleInitArgs;
export type BattleInitArgName = Protocol.BattleInitArgName;
export type BattleInitArgType = Protocol.BattleInitArgType;

export type BattleProgressArgs = Protocol.BattleProgressArgs;
export type BattleProgressArgName = Protocol.BattleProgressArgName;
export type BattleProgressArgType = Protocol.BattleProgressArgType;

export type BattleMajorArgs = Protocol.BattleMajorArgs;
export type BattleMajorArgName = Protocol.BattleMajorArgName;
export type BattleMajorArgType = Protocol.BattleMajorArgType;

export type BattleMinorArgs = Protocol.BattleMinorArgs;
export type BattleMinorArgName = Protocol.BattleMinorArgName;
export type BattleMinorArgType = Protocol.BattleMinorArgType;

export type BattleArgs = Protocol.BattleArgs;
export type BattleArgName = Protocol.BattleArgName;
export type BattleArgType = Protocol.BattleArgType;

export type BattleArgsKWArgsTypes = Protocol.BattleArgsKWArgsTypes;
export type BattleArgsWithKWArgs = Protocol.BattleArgsWithKWArgs;

export type BattleArgsWithKWArgName = Protocol.BattleArgsWithKWArgName;
export type BattleArgsWithKWArgType = Protocol.BattleArgsWithKWArgType;

export type BattleArgKWArgs<T extends BattleArgName> = Protocol.BattleArgKWArgs<T>;

export type BattleArgsKWArgs = Protocol.BattleArgsKWArgs;
export type BattleArgsKWArgName = Protocol.BattleArgsKWArgName;
export type BattleArgsKWArgType = Protocol.BattleArgsKWArgType;

export type Args = Protocol.Args;
export type ArgName = Protocol.ArgName;
export type ArgType = Protocol.ArgType;

export type KWArgs = Protocol.KWArgs;
export type KWArgType = Protocol.KWArgType;
export type ArgsWithKWArgName = Protocol.ArgsWithKWArgName;
export type ArgsWithKWArgType = Protocol.ArgsWithKWArgType;

export type Handler<T> = Protocol.Handler<T>;

export interface PokemonHealth {
  hp: number;
  maxhp: number;
  hpcolor: HPColor | '';
  status: StatusName | 'tox' | '' | '???';
  fainted?: boolean;
}

export interface DetailedPokemon {
  details: PokemonDetails;
  name: string;
  species: string;
  level: number;
  shiny: boolean;
  gender: GenderName | '';
  ident: PokemonIdent;
  searchid: PokemonSearchID;
}

function toID(s: string): ID {
  return ('' + s).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}

export const Protocol = new class {
  // NOTE: An object is used here to get TypeScript to perform exhaustiveness checking
  ARGS: {[k in Protocol.ArgName]: 1} = {
    '|init|': 1, '|title|': 1, '|userlist|': 1, '||': 1, '|html|': 1, '|uhtml|': 1,
    '|uhtmlchange|': 1, '|join|': 1, '|leave|': 1, '|name|': 1, '|chat|': 1, '|:|': 1, '|c:|': 1,
    '|battle|': 1, '|popup|': 1, '|pm|': 1, '|usercount|': 1, '|nametaken|': 1, '|challstr|': 1,
    '|updateuser|': 1, '|formats|': 1, '|updatesearch|': 1, '|switchout|': 1, '|message|': 1,
    '|updatechallenges|': 1, '|queryresponse|': 1, '|unlink|': 1, '|raw|': 1, '|warning|': 1,
    '|error|': 1, '|bigerror|': 1, '|chatmsg|': 1, '|chatmsg-raw|': 1, '|controlshtml|': 1,
    '|fieldhtml|': 1, '|debug|': 1, '|tournament|create|': 1, '|tournament|update|': 1,
    '|tournament|updateEnd|': 1, '|tournament|error|': 1, '|tournament|forceend|': 1,
    '|tournament|join|': 1, '|tournament|leave|': 1, '|tournament|replace|': 1,
    '|tournament|start|': 1, '|tournament|disqualify|': 1, '|tournament|battlestart|': 1,
    '|tournament|battleend|': 1, '|tournament|end|': 1, '|tournament|scouting|': 1,
    '|tournament|autostart|': 1, '|tournament|autodq|': 1, '|player|': 1, '|teamsize|': 1,
    '|gametype|': 1, '|gen|': 1, '|tier|': 1, '|rated|': 1, '|seed|': 1, '|rule|': 1,
    '|teampreview|': 1, '|clearpoke|': 1, '|poke|': 1, '|start|': 1, '|done|': 1, '|request|': 1,
    '|inactive|': 1, '|inactiveoff|': 1, '|upkeep|': 1, '|turn|': 1, '|win|': 1, '|tie|': 1,
    '|move|': 1, '|switch|': 1, '|drag|': 1, '|detailschange|': 1, '|replace|': 1, '|swap|': 1,
    '|cant|': 1, '|faint|': 1, '|-formechange|': 1, '|-fail|': 1, '|-block|': 1, '|-notarget|': 1,
    '|-miss|': 1, '|-damage|': 1, '|-heal|': 1, '|-sethp|': 1, '|-status|': 1, '|-curestatus|': 1,
    '|-cureteam|': 1, '|-boost|': 1, '|-unboost|': 1, '|-setboost|': 1, '|-swapboost|': 1,
    '|-invertboost|': 1, '|-clearboost|': 1, '|-clearallboost|': 1, '|-clearpositiveboost|': 1,
    '|-ohko|': 1, '|-clearnegativeboost|': 1, '|-copyboost|': 1, '|-weather|': 1,
    '|-fieldstart|': 1, '|-fieldend|': 1, '|-sidestart|': 1, '|-sideend|': 1, '|-start|': 1,
    '|-end|': 1, '|-crit|': 1, '|-supereffective|': 1, '|-resisted|': 1, '|-immune|': 1,
    '|-item|': 1, '|-enditem|': 1, '|-ability|': 1, '|-endability|': 1, '|-transform|': 1,
    '|-mega|': 1, '|-primal|': 1, '|-burst|': 1, '|-zpower|': 1, '|-zbroken|': 1, '|-activate|': 1,
    '|-fieldactivate|': 1, '|-hint|': 1, '|-center|': 1, '|-message|': 1, '|-combine|': 1,
    '|-waiting|': 1, '|-prepare|': 1, '|-mustrecharge|': 1, '|-hitcount|': 1, '|-singlemove|': 1,
    '|-singleturn|': 1, '|-anim|': 1,
  };
  ARGS_WITH_KWARGS: {[k in Protocol.ArgsWithKWArgName]: 1} = {
    '|move|': 1, '|detailschange|': 1, '|cant|': 1, '|-formechange|': 1, '|-fail|': 1,
    '|-block|': 1, '|-damage|': 1, '|-heal|': 1, '|-sethp|': 1, '|-status|': 1, '|swap|': 1,
    '|-curestatus|': 1, '|-cureteam|': 1, '|-boost|': 1, '|-unboost|': 1, '|-setboost|': 1,
    '|-swapboost|': 1, '|-invertboost|': 1, '|-clearnegativeboost|': 1, '|-weather|': 1,
    '|-fieldactivate|': 1, '|-fieldstart|': 1, '|-fieldend|': 1, '|-sideend|': 1, '|-start|': 1,
    '|-end|': 1, '|-crit|': 1, '|-supereffective|': 1, '|-resisted|': 1, '|-immune|': 1,
    '|-item|': 1, '|-enditem|': 1, '|-ability|': 1, '|-endability|': 1, '|-transform|': 1,
    '|-activate|': 1, '|-singleturn|': 1, '|switchout|': 1, '|-miss|': 1, '|-clearallboost|': 1,
    '|-copyboost|': 1, '|-clearboost|': 1, '|-clearpositiveboost|': 1, '|-singlemove|': 1,
  };

  *handle(data: string) {
    const lines = data.split('\n');
    let roomid = '' as Protocol.RoomID;
    for (const [i, line] of lines.entries()) {
      if (i === 0 && line[0] === '>') {
        roomid = line.slice(1) as Protocol.RoomID;
        continue;
      } else if (line) {
        yield [roomid, this.parseBattleLine(line)] as [Protocol.RoomID, {
          args: Protocol.BattleArgType;
          kwArgs: Protocol.BattleArgsKWArgType;
        }];
      }
    }
  }

  key(args: Protocol.ArgType): Protocol.ArgName | undefined {
    const key = (args[0] === 'tournament'
      ? `|${args[0]}|${args[1]}|`
      : `|${args[0]}|`) as Protocol.ArgName;
    return key in this.ARGS ? key : undefined;
  }

  parseLine(line: string, noDefault?: boolean): Protocol.ArgType | null {
    if (!line.startsWith('|')) return ['', line] as const as Protocol.RoomMessageArgs['||'];
    if (line === '|') return ['done'];
    const index = line.indexOf('|', 1);
    const cmd = line.slice(1, index);
    switch (cmd) {
    case 'chatmsg': case 'chatmsg-raw': case 'raw': case 'error': case 'html':
    case 'inactive': case 'inactiveoff': case 'warning':
    case 'fieldhtml': case 'controlshtml': case 'bigerror':
    case 'debug': case 'tier': case 'challstr': case 'popup': case '':
      return upgradeArgs([cmd, line.slice(index + 1)]);
    case 'c': case 'chat': case 'uhtml': case 'uhtmlchange':
      // three parts
      const index2a = line.indexOf('|', index + 1);
      return upgradeArgs([cmd, line.slice(index + 1, index2a), line.slice(index2a + 1)]);
    case 'c:': case 'pm':
      // four parts
      const index2b = line.indexOf('|', index + 1);
      const index3b = line.indexOf('|', index2b + 1);
      return upgradeArgs([
        cmd,
        line.slice(index + 1, index2b),
        line.slice(index2b + 1, index3b),
        line.slice(index3b + 1),
      ]);
    }
    if (noDefault) return null;
    return upgradeArgs(line.slice(1).split('|') as [string, ...string[]]);
  }

  parseBattleLine(line: string) {
    let args = Protocol.parseLine(line, true) as [string, ...string[]];
    if (args) return {args: args as Protocol.ArgType, kwArgs: {}};

    args = line.slice(1).split('|') as [string, ...string[]];
    const kwArgs: { [kw: string]: string | true } = {};
    while (args.length > 1) {
      const lastArg = args[args.length - 1];
      if (lastArg.charAt(0) !== '[') break;
      const bracketPos = lastArg.indexOf(']');
      if (bracketPos <= 0) break;
      // default to '.' so it evaluates to boolean true
      kwArgs[lastArg.slice(1, bracketPos)] = lastArg.slice(bracketPos + 1).trim() || true;
      args.pop();
    }

    return upgradeBattleArgs({
      args: args as Protocol.BattleArgType, kwArgs,
    }) as {
      args: Protocol.BattleArgType;
      kwArgs: Protocol.BattleArgsKWArgType;
    };
  }

  parsePokemonIdent(pokemon: Protocol.PokemonIdent) {
    const index = pokemon.indexOf(':');
    const position = pokemon.slice(0, index);
    const name = pokemon.slice(index + 1);

    let player: Player;
    let letter: Protocol.PositionLetter | null;
    if (position.length < 3) {
      player = position as Player;
      letter = null;
    } else {
      player = position.slice(0, 2) as Player;
      letter = position.charAt(2) as Protocol.PositionLetter;
    }

    return {player, position: letter, name};
  }

  parseDetails(
    name: string,
    ident: Protocol.PokemonIdent,
    details = '' as Protocol.PokemonDetails,
    output = {} as DetailedPokemon
  ) {
    output.details = details;

    output.name = name;
    output.species = name;
    output.level = 100;
    output.shiny = false;
    output.gender = '';
    output.ident = name ? ident : '' as Protocol.PokemonIdent;
    output.searchid = (name ? `${ident}|${details}` : '') as Protocol.PokemonSearchID;

    const splitDetails = details.split(', ');
    if (splitDetails[splitDetails.length - 1] === 'shiny') {
      output.shiny = true;
      splitDetails.pop();
    }
    const gender = splitDetails[splitDetails.length - 1];
    if (gender === 'M' || gender === 'F') {
      output.gender = gender as GenderName;
      splitDetails.pop();
    }
    if (splitDetails[1]) output.level = parseInt(splitDetails[1].substr(1)) || 100;
    if (splitDetails[0]) output.species = splitDetails[0];
    return output;
  }

  parseHealth(hpstring: Protocol.PokemonHPStatus, output = {} as PokemonHealth) {
    const [hp, status] = hpstring.split(' ');

    // parse hp
    output.hpcolor = '';
    if (hp === '0' || hp === '0.0') {
      if (!output.maxhp) output.maxhp = 100;
      output.hp = 0;
    } else if (hp.indexOf('/') > 0) {
      const [curhp, maxhp] = hp.split('/');
      if (isNaN(parseFloat(curhp)) || isNaN(parseFloat(maxhp))) {
        return null;
      }
      output.hp = parseFloat(curhp);
      output.maxhp = parseFloat(maxhp);
      if (output.hp > output.maxhp) output.hp = output.maxhp;
      const colorchar = maxhp.slice(-1);
      if (colorchar === 'y' || colorchar === 'g') {
        output.hpcolor = colorchar;
      }
    } else if (!isNaN(parseFloat(hp))) {
      if (!output.maxhp) output.maxhp = 100;
      output.hp = (output.maxhp * parseFloat(hp)) / 100;
    }

    // parse status
    if (!status) {
      output.status = '';
    } else if (
      status === 'par' ||
      status === 'brn' ||
      status === 'slp' ||
      status === 'frz' ||
      status === 'tox'
    ) {
      output.status = status;
    } else if (status === 'psn' && output.status !== 'tox') {
      output.status = status;
    } else if (status === 'fnt') {
      output.hp = 0;
      output.fainted = true;
    }
    return output;
  }

  parseEffect(
    effect?: string, fn = (s: string) => s.trim()
  ): { name: string; type?: 'move' | 'item' | 'ability' } {
    if (!effect) return {name: fn('')};
    if (effect.startsWith('item:') || effect.startsWith('move:')) {
      return {name: fn(effect.slice(5)), type: effect.slice(0, 4) as 'move' | 'item'};
    } else if (effect.startsWith('ability:')) {
      return {name: fn(effect.slice(8)), type: 'ability'};
    }
    return {name: fn(effect)};
  }

  // parseCondition(condition: Protocol.PokemonCondition) {
  //   return null; // TODO
  // }

  parseRequest(json: Protocol.RequestJSON) {
    return JSON.parse(json) as Protocol.Request;
  }

  parseChallenges(json: Protocol.ChallengesJSON) {
    return JSON.parse(json) as Protocol.Challenges;
  }

  parseSearchState(json: Protocol.SearchStateJSON) {
    return JSON.parse(json) as Protocol.SearchState;
  }

  parseTournamentUpdate(json: Protocol.TournamentUpdateJSON) {
    return JSON.parse(json) as Protocol.TournamentUpdate;
  }

  parseNameParts(text: string) {
    let group = '';
    // names can't start with a symbol
    if (!/[A-Za-z0-9]/.test(text.charAt(0))) {
      group = text.charAt(0);
      text = text.slice(1);
    }

    let name = text;
    const atIndex = text.indexOf('@');
    let status = '';
    let away = false;
    if (atIndex > 0) {
      name = text.slice(0, atIndex);
      status = text.slice(atIndex + 1);
      if (status.startsWith('!')) {
        away = true;
        status = status.slice(1);
      }
    }
    return {group, name, away, status};
  }
};

function upgradeArgs<T extends Protocol.ArgType>(args: [string, ...string[]]): T {
  switch (args[0]) {
  case 'name': case 'n': case 'N': {
    const [cmd, user, oldid] = args;
    return ['name', user, oldid, cmd === 'N'] as const as T;
  }
  case 'chat': case 'c': {
    const [, user, message] = args;
    return ['chat', user, message] as const as T;
  }
  case 'join': case 'j': case 'J': {
    const [cmd, user] = args;
    return ['join', user, cmd === 'J'] as const as T;
  }
  case 'leave': case 'l': case 'L': {
    const [cmd, user] = args;
    return ['leave', user, cmd === 'L'] as const as T;
  }
  case 'battle': case 'b': {
    const [, roomid, user1, user2] = args;
    return ['battle', roomid, user1, user2] as const as T;
  }
  }
  return args as T;
}

const BLOCKABLE = new Set([
  'ingrain', 'quickguard', 'wideguard', 'craftyshield', 'matblock',
  'protect', 'mist', 'safeguard', 'electricterrain', 'mistyterrain',
  'psychicterrain', 'telepathy', 'stickyhold', 'suctioncups', 'aromaveil',
  'flowerveil', 'sweetveil', 'disguise', 'safetygoggles', 'protectivepads',
]);
const STARTABLE = new Set([
  'wrap', 'clamp', 'whirlpool', 'firespin', 'magmastorm',
  'sandtomb', 'infestation', 'charge', 'trapped', 'bind',
]);
const NUMBERABLE = new Set(['spite', 'grudge', 'forewarn', 'sketch', 'leppaberry', 'mysteryberry']);

function upgradeBattleArgs(
  {args, kwArgs}: { args: Protocol.BattleArgType; kwArgs: { [kw: string]: string | true } }
): { args: Protocol.BattleArgType; kwArgs: Protocol.BattleArgsKWArgType } {
  switch (args[0]) {
  case '-activate': {
    if (kwArgs.item || kwArgs.move || kwArgs.number || kwArgs.ability) return {args, kwArgs};
    const [, pokemon, e, arg3, arg4] = args;
    const effect = e as Protocol.EffectName;

    const target = kwArgs.of as Protocol.PokemonIdent | undefined;
    const id = Protocol.parseEffect(effect, toID).name;

    if (kwArgs.block) return {args: ['-fail', pokemon], kwArgs};
    if (id === 'sturdy') {
      return {args: ['-activate', pokemon, 'ability: Sturdy' as Protocol.EffectName], kwArgs};
    }
    if (id === 'wonderguard') {
      return {
        args: ['-immune', pokemon],
        kwArgs: {from: 'ability:Wonder Guard'} as Protocol.BattleArgsKWArgType,
      };
    }
    if (id === 'beatup' && kwArgs.of) {
      return {args, kwArgs: {name: kwArgs.of as Protocol.PokemonIdent}};
    }
    if (BLOCKABLE.has(id)) {
      if (target) {
        kwArgs.of = pokemon;
        return {args: ['-block', target, effect, arg3 as Protocol.MoveName], kwArgs};
      }
      return {args: ['-block', pokemon, effect, arg3 as Protocol.MoveName], kwArgs};
    }

    if (STARTABLE.has(id)) {
      return {
        args: ['-start', pokemon, effect],
        kwArgs: {of: target as Protocol.PokemonIdent} as Protocol.BattleArgsKWArgType,
      };
    }
    if (id === 'fairylock') return {args: ['-fieldactivate', effect], kwArgs: {}};

    if (id === 'symbiosis') {
      kwArgs.item = arg3!;
    } else if (id === 'magnitude') {
      kwArgs.number = arg3!;
    } else if (id === 'skillswap' || id === 'mummy' || id === 'wanderingspirit') {
      kwArgs.ability = arg3!;
      kwArgs.ability2 = arg4!;
    } else if (NUMBERABLE.has(id)) {
      kwArgs.move = arg3!;
      kwArgs.number = arg4!;
    }
    return {args: ['-activate', pokemon, effect, (target || '') as Protocol.PokemonIdent], kwArgs};
  }
  case '-start': {
    if (kwArgs.from === 'Protean' || kwArgs.from === 'Color Change') {
      kwArgs.from = 'ability:' + kwArgs.from;
    }
    break;
  }
  case 'move': {
    if (kwArgs.from === 'Magic Bounce') kwArgs.from = 'ability:Magic Bounce';
    break;
  }
  case 'cant': {
    const [, pokemon, effect, move] = args;
    const abilities = ['ability: Queenly Majesty', 'ability: Damp', 'ability: Dazzling'];
    if (abilities.includes(effect as Protocol.EffectName)) {
      return {
        args: [
          '-block',
          pokemon,
          effect as Protocol.EffectName,
          move as Protocol.MoveName,
          kwArgs.of as Protocol.PokemonIdent,
        ],
        kwArgs: {},
      };
    }
    break;
  }
  case 'gen': {
    const [, num] = args;
    return {args: ['gen', Number(num) as GenerationNum], kwArgs: {}};
  }
  // @ts-ignore
  case '-nothing':
    // OLD: |-nothing
    // NEW: |-activate||move:Splash
    args = [
      '-activate', '' as Protocol.PokemonIdent,
      'move:Splash' as Protocol.EffectName,
    ] as Protocol.Args['|-activate|'];
  }

  return {args, kwArgs};
}