import { SettingsProvider } from './contexts/SettingsContext';
import { useGame } from './hooks/useGame';
import { Lobby } from './components/screens/Lobby';
import { GameBoard } from './components/game/GameBoard';
import { GameOver } from './components/screens/GameOver';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

const GameContainer = () => {
  const { gameState, startGame, playCard, resetGame } = useGame();

  if (gameState.phase === 'lobby') {
    return <Lobby onStart={startGame} />;
  }

  return (
    <>
      <GameBoard gameState={gameState} onPlayCard={(card) => playCard('p1', card)} />
      {gameState.phase === 'game-over' && (
        <GameOver 
          winnerId={gameState.winner} 
          players={gameState.players} 
          onPlayAgain={resetGame} 
        />
      )}
    </>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <pre className="bg-black/50 p-4 rounded mb-4 overflow-auto max-w-lg">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="bg-white text-red-900 px-4 py-2 rounded font-bold">Try again</button>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SettingsProvider>
        <GameContainer />
        <Toaster position="top-center" theme="dark" />
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;

