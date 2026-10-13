export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string; // slug, e.g. "bloque-buster"
  title: string;
  short: string;
  long: string;
  category: Category;
  cover: string; // CSS class, e.g. "cover-bricks"
  color: GameColor; // picks the JUGAR button variant
  plays: string; // fixed display value, e.g. "12.4K"
};

// Cover classes match the names ported to app/globals.css
// (the template's cover-glot/rocas/rana/duelo were renamed there).
export const GAMES: Game[] = [
  {
    id: "bloque-buster",
    title: "BLOQUE BUSTER",
    short: "Rebota la pelota y destruye muros de neón.",
    long: "Pilota una nave-paleta y rebota un núcleo de plasma para pulverizar muros de bloques cromáticos. Cada nivel reorganiza la grilla en patrones imposibles. ¿Hasta dónde llegará tu racha?",
    category: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    plays: "12.4K",
  },
  {
    id: "caida",
    title: "CAÍDA",
    short: "Encaja las piezas antes de que el techo te aplaste.",
    long: "Piezas geométricas descienden desde la oscuridad. Rótalas, encástralas y limpia líneas para sobrevivir. La velocidad aumenta sin piedad cada 10 líneas.",
    category: "PUZZLE",
    cover: "cover-tetro",
    color: "magenta",
    plays: "31.8K",
  },
  {
    id: "serpentina",
    title: "SERPENTINA",
    short: "Crece sin morder tu propia cola.",
    long: "Una serpiente de luz recorre la grilla buscando núcleos magenta. Cada bocado la alarga y la hace más veloz. Un movimiento en falso y se devora a sí misma.",
    category: "ARCADE",
    cover: "cover-snake",
    color: "green",
    plays: "9.1K",
  },
  {
    id: "gloton",
    title: "GLOTÓN",
    short: "Devora puntos y escapa de los fantasmas.",
    long: "Un círculo glotón patrulla un laberinto coleccionando puntos luminosos. Cuatro espectros lo persiguen, pero cada cierto tiempo aparece una píldora que invierte los papeles.",
    category: "ARCADE",
    cover: "cover-glutton",
    color: "yellow",
    plays: "27.2K",
  },
  {
    id: "invasores",
    title: "INVASORES",
    short: "Defiende el planeta de filas alienígenas.",
    long: "Olas de pixeles hostiles descienden formación tras formación. Mueve tu cañón en horizontal y abre fuego con precisión, antes de que toquen la superficie.",
    category: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    plays: "18.0K",
  },
  {
    id: "rocas",
    title: "ROCAS",
    short: "Pulveriza asteroides en gravedad cero.",
    long: "Tu nave triangular flota en vacío absoluto. Dispara y rota para dividir rocas en fragmentos cada vez más pequeños. Cuidado con los OVNIs en el horizonte.",
    category: "SHOOTER",
    cover: "cover-rocks",
    color: "yellow",
    plays: "15.6K",
  },
  {
    id: "ranaria",
    title: "RANARIA",
    short: "Cruza la autopista de pixeles.",
    long: "Salta entre carriles de coches a toda velocidad y troncos a la deriva en el río. Llega a los nenúfares antes de que se acabe el tiempo.",
    category: "ARCADE",
    cover: "cover-frog",
    color: "green",
    plays: "6.4K",
  },
  {
    id: "duelo-pixel",
    title: "DUELO PIXEL",
    short: "Dos paletas. Una pelota. Reflejos máximos.",
    long: "El duelo más puro: dos paletas verticales se enfrentan por rebotar una pelota luminosa. Modo solitario contra la CPU o partida local a dos jugadores.",
    category: "VERSUS",
    cover: "cover-duel",
    color: "cyan",
    plays: "4.2K",
  },
];

export const CATEGORIES: ("TODOS" | Category)[] = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];

export function getGame(id: string): Game | undefined {
  return GAMES.find((game) => game.id === id);
}
