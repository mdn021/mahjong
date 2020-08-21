import React, {useEffect, useState} from 'react';
import Board from './Board';
import Player from './Player';
import './App.css';

const App = () => {

  var defaultBoard = [];

  /* setting up default board */
  (() => {
    for (var a = 0; a < 4; a++) {
      /* add number tiles */
      var i, j, k;
      i = j = k = 0;

      /* characters tiles */
      while (i < 9) {
        defaultBoard.push(`0${i + 1}-c${i + 1}`);
        i++;
      }

      /* stone tiles */
      while (j < 9) {
        defaultBoard.push(`${9 + j + 1}-s${j + 1}`);
        j++;
      }

      /* bamboo tiles */
      while (k < 9) {
        defaultBoard.push(`${18 + k + 1}-b${k + 1}`);
        k++;
      }

      /* add wind tiles */
      defaultBoard.push('28-east', '29-south', '30-west', '31-north');

      /* add dragons */
      defaultBoard.push('32-red', '33-white', '34-green');
    }
  })();
  
  const [board, setBoard] = useState(defaultBoard);
  const [players, setPlayers] = useState({
    player1: [],
    player2: [],
    player3: [],
    player4: []
  });

  useEffect(() => {
    // console.log(board);
  });

  const shuffle = newBoard => {
    setBoard(newBoard);
    console.log(newBoard);
  };

  const distribute = () => {
    console.log('distributing tiles');
    /* for player 1 */
    var player1Tiles = []; 
    var player2Tiles = []; 
    var player3Tiles = []; 
    var player4Tiles = [];
    

    for (var i = 0; i < 4; i++) {
      /* player 1 */
      player1Tiles.push(board[i]);
      player1Tiles.push(board[16+i]);
      player1Tiles.push(board[32+i]);
      /* player 2 */
      player2Tiles.push(board[i+4]);
      player2Tiles.push(board[20+i]);
      player2Tiles.push(board[36+i]);
      /* player 3 */
      player3Tiles.push(board[i+8]);
      player3Tiles.push(board[24+i]);
      player3Tiles.push(board[40+i]);
      /* player 4 */
      player4Tiles.push(board[i+12]);
      player4Tiles.push(board[28+i]);
      player4Tiles.push(board[44+i]);
    }

    /* final tile */
    player1Tiles.push(board[48]);
    player2Tiles.push(board[49]);
    player3Tiles.push(board[50]);
    player4Tiles.push(board[51]);
    
    console.log(player1Tiles.toString())

    setPlayers({
      player1: player1Tiles.sort(),
      player2: player2Tiles.sort(),
      player3: player3Tiles.sort(),
      player4: player4Tiles.sort()
    })
  };

  return(
    <div className="board">
      <Board board={board} onClick={shuffle}/>
      <Player name="Player 1" player={players.player1} />
      <Player name="Player 2" player={players.player2} />
      <Player name="Player 3" player={players.player3} />
      <Player name="Player 4" player={players.player4} />

      <button onClick={distribute}>Distribute Tiles</button>
    </div>
  );
};

export default App;
