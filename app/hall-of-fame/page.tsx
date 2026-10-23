import { GAMES } from '@/app/data/games';
import HallOfFameClient from './HallOfFameClient';

export default function HallOfFame() {
  return <HallOfFameClient games={GAMES} initialTab={GAMES[0]?.id ?? ''} />;
}
