import React, {useEffect, useState} from 'react';
import Board from './Board';
import Player from './Player';
import './App.css';

const App = () => {

  var defaultBoard = [];

  /* setting up default board */
  // (() => {
  //   for (var a = 0; a < 4; a++) {
  //     /* add number tiles */
  //     var i, j, k;
  //     i = j = k = 0;

  //     /* characters tiles */
  //     while (i < 9) {
  //       defaultBoard.push(`0${i + 1}-c${i + 1}`);
  //       i++;
  //     }

  //     /* stone tiles */
  //     while (j < 9) {
  //       defaultBoard.push(`${9 + j + 1}-s${j + 1}`);
  //       j++;
  //     }

  //     /* bamboo tiles */
  //     while (k < 9) {
  //       defaultBoard.push(`${18 + k + 1}-b${k + 1}`);
  //       k++;
  //     }

  //     /* add wind tiles */
  //     defaultBoard.push('28-east', '29-south', '30-west', '31-north');

  //     /* add dragons */
  //     defaultBoard.push('32-red', '33-white', '34-green');
  //   }
  // })();

  (() => {
    for (var a = 0; a < 4; a++) {
      for (var i = 1; i <= 34; i++) {
        defaultBoard.push(i);
      }
    }
  })();
  
  const [board, setBoard] = useState(defaultBoard);
  const [diceRoll, setDice] = useState(0);
  const [players, setPlayers] = useState({
    player1: [],
    player2: [],
    player3: [],
    player4: []
  });
  const [gameState, setGameState] = useState({
    started: false,
    currPlayer: "player1",
    currTile: 0,
    realPlayers: ["player1"],
    CPUPlayers: ["player2", "player3", "player4"]
  });

  useEffect(() => {
    // console.log(board);
  });

  const shuffle = newBoard => {
    setBoard(newBoard);
  };

  const rollDice = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    const sumDiceRoll = dice1 + dice2;
    setDice(sumDiceRoll);
    return sumDiceRoll;
  };

  const findDistributeStart = () => {
    const sum = rollDice();
    console.log(sum);
    const mod = sum % 4;
    var start = 0;
    switch (mod) {
      case 1:
        start = 0;
        break;
      case 2:
        start = 17;
        break;
      case 3:
        start = 34;
        break;
      case 4:
        start = 51;
        break;
      default:
        start = 0;
        break;
    }

    return start + sum;
  };

  const distribute = () => {
    console.log('distributing tiles');

    const start = findDistributeStart();
    const firstSplit = board.slice(start, board.length);
    const secondSplit = board.slice(0, start);
    const newBoard = firstSplit.concat(secondSplit);
    setBoard(newBoard);

    var player1Tiles = []; 
    var player2Tiles = []; 
    var player3Tiles = []; 
    var player4Tiles = [];    

    for (var i = 0; i < 4; i++) {
      /* player 1 */
      player1Tiles.push(newBoard[i]);
      player1Tiles.push(newBoard[16+i]);
      player1Tiles.push(newBoard[32+i]);
      /* player 2 */
      player2Tiles.push(newBoard[i+4]);
      player2Tiles.push(newBoard[20+i]);
      player2Tiles.push(newBoard[36+i]);
      /* player 3 */
      player3Tiles.push(newBoard[i+8]);
      player3Tiles.push(newBoard[24+i]);
      player3Tiles.push(newBoard[40+i]);
      /* player 4 */
      player4Tiles.push(newBoard[i+12]);
      player4Tiles.push(newBoard[28+i]);
      player4Tiles.push(newBoard[44+i]);
    }

    /* final tile */
    player1Tiles.push(newBoard[48]);
    player2Tiles.push(newBoard[49]);
    player3Tiles.push(newBoard[50]);
    player4Tiles.push(newBoard[51]);

    /* player 1's draw tile */
    player1Tiles.push(newBoard[52]);

    console.log(player1Tiles.sort((a, b) => { return a - b }));
    
    setPlayers({
      player1: player1Tiles.sort(compareTilePriority),
      player2: player2Tiles.sort(compareTilePriority),
      player3: player3Tiles.sort(compareTilePriority),
      player4: player4Tiles.sort(compareTilePriority)
    });

    updateGameState(true, gameState.currPlayer, 53);
  };

  const compareTilePriority = (a, b) => {
    return a - b;
  }

  const updateHand = (player, newHand) => {
    if (gameState.currPlayer !== player) {
      console.log(`Currently ${gameState.currPlayer}'s turn.`);
      return;
    }

    /* update the current players hand with the discarded tile removed */
    var currentHands = {...players};
    currentHands[player] = newHand;
    
    /* get the next player, draw the next tile, update next players hand */
    const nextPlayer = findNextPlayer(player);
    currentHands[nextPlayer].push(board[gameState.currTile]);
    
    setPlayers(currentHands);
    
    /* update the game state */
    const nextTile = gameState.currTile + 1;
    updateGameState(gameState.started, nextPlayer, nextTile);
  };

  const findNextPlayer = currPlayer => {
    switch (currPlayer) {
      case "player1":
        return "player2";
      case "player2":
        return "player3";
      case "player3":
        return "player4";
      case "player4":
        return "player1";
      default:
        return;
    }
  };

  const updateGameState = (started, player, tileIndex) => {
    console.log(`updating currPlayer to ${player}`);
    setGameState({
      started: started,
      currPlayer: player,
      currTile: tileIndex,
      realPlayers: gameState.realPlayers,
      CPUPlayers: gameState.CPUPlayers
    });
  }

  return(
    <div className="board">
      <Board board={board} onClick={shuffle}/>
      <button onClick={distribute}>Distribute Tiles</button>
      <h1>Dice Roll: {diceRoll}</h1>
      <Player name="Player 1" index="player1" hand={players.player1} onClick={updateHand}/>
      <Player name="Player 2" index="player2" hand={players.player2} onClick={updateHand}/>
      <Player name="Player 3" index="player3" hand={players.player3} onClick={updateHand}/>
      <Player name="Player 4" index="player4" hand={players.player4} onClick={updateHand}/>
    </div>
  );
};

export default App;
