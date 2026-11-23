import type { GameViewProps } from '../types';
import type { TTTAction, TTTState } from './logic';

export function TicTacToeView({ state, me, dispatch }: GameViewProps<TTTState, TTTAction>) {
  const myTurn = state.players[state.turn] === me && !state.winner;
  return (
    <div className="mx-auto grid w-72 grid-cols-3 gap-2">
      {state.board.map((c, i) => (
        <button
          key={i}
          disabled={!myTurn || !!c}
          onClick={() => dispatch({ type: 'play', index: i })}
          className="aspect-square rounded-theme border-theme border-primary bg-surface-2 font-display text-3xl text-primary disabled:opacity-70"
        >
          {c}
        </button>
      ))}
      {state.winner && (
        <button
          className="col-span-3 rounded-theme bg-primary p-2 text-white"
          onClick={() => dispatch({ type: 'reset' })}
        >
          {state.winner === 'draw' ? 'Draw' : state.winner === me ? 'You win' : 'You lose'}. Play again
        </button>
      )}
    </div>
  );
}
