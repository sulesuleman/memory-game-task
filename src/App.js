import Game from './container/Game/Game';
import './App.scss';

function App() {
  return (
    <div className="_container">
      <div style={{ flex: 0.2 }}>
        <center>
          <span className="text"> Find the pairs</span>
        </center>
      </div>
      <div style={{ flex: 0.8 }}>
        <Game />
      </div>
    </div>
  );
}

export default App;
