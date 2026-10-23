export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: 'ARCADE' | 'PUZZLE' | 'SHOOTER';
  cover: string;
  color: 'cyan' | 'magenta' | 'yellow' | 'green';
}

export const GAMES: Game[] = [
  {
    id: 'asteroids',
    title: 'ASTEROIDS',
    short: 'Pulveriza rocas en gravedad cero.',
    long: 'Tu nave triangular flota en vacío absoluto. Dispara y rota para dividir rocas en fragmentos cada vez más pequeños. Supera niveles y acumula puntos antes de que los asteroides te alcancen.',
    cat: 'SHOOTER',
    cover: 'cover-rocas',
    color: 'yellow',
  },
  {
    id: 'tetris',
    title: 'TETRIS',
    short: 'Apila tetrominos antes de que el techo te aplaste.',
    long: 'Siete piezas, diez columnas, una sola regla: no dejes que el tablero llegue arriba. Gira y encaja tetrominos para completar líneas y ganar puntos; cada nivel te las acelera un poco más.',
    cat: 'PUZZLE',
    cover: 'cover-tetro',
    color: 'cyan',
  },
  {
    id: 'arkanoid',
    title: 'ARKANOID',
    short: 'Rompe todos los bloques antes de perder tus 3 vidas.',
    long: 'Controla la paleta y rebota la pelota para destruir todos los bloques. Cinco niveles con patrones distintos y velocidad creciente ponen a prueba tus reflejos. Completa el nivel 5 sin agotar tus vidas para ganar.',
    cat: 'ARCADE',
    cover: 'cover-bricks',
    color: 'cyan',
  },
  {
    id: 'snake',
    title: 'SNAKE',
    short: 'Come frutas, crece y no te muerdas la cola.',
    long: 'Guía a la serpiente por el tablero comiendo frutas que aparecen aleatoriamente. Cada fruta que comes hace crecer tu cuerpo y sube tu puntuación. La partida termina si chocas contra una pared o contra ti mismo.',
    cat: 'ARCADE',
    cover: 'cover-snake',
    color: 'green',
  },
];

export function getGame(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}
