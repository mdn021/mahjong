import React, {useEffect, useState} from 'react';
import Board from './Board';
import Player from './Player';
import './App.css';

const App = () => {

  /* set up default board */
  var defaultBoard = [];
  (() => {
    for (var a = 0; a < 4; a++) {
      for (var i = 1; i <= 9; i++) {
        defaultBoard.push(i);
      }

      for (var j = 11; j <= 19; j++) {
        defaultBoard.push(j);
      }

      for (var k = 21; k <= 29; k++) {
        defaultBoard.push(k);
      }

      for (var l = 31; l <= 34; l++) {
        defaultBoard.push(l);
      }

      for (var m = 41; m <= 43; m++) {
        defaultBoard.push(m);
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
    currPlayer: "none",
    currTile: 0,
    realPlayers: ["player1"],
    CPUPlayers: ["player2", "player3", "player4"]
  });

  useEffect(() => {
    if (!gameState.started) {
      return;
    }

    drawTile();

    if (gameState.CPUPlayers.includes(gameState.currPlayer)) {
      // TODO: Check if CPU somehow has a winning hand 
      // Add function call here

      var currentHands = { ...players };
      
      // console.log(`Pre-pop: ${JSON.stringify(currentHands)}`);
      currentHands[gameState.currPlayer].pop();
      // console.log(`Post-pop: ${JSON.stringify(currentHands)}`);

      /* get the next player, draw the next tile, update next players hand */
      const nextPlayer = findNextPlayer(gameState.currPlayer);

      setPlayers(currentHands);

      /* update the game state */
      const nextTile = gameState.currTile + 1;
      updateGameState(nextPlayer, nextTile);
    }
  }, [gameState.currPlayer]);

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
    
    setPlayers({
      player1: player1Tiles.sort(compareTilePriority),
      player2: player2Tiles.sort(compareTilePriority),
      player3: player3Tiles.sort(compareTilePriority),
      player4: player4Tiles.sort(compareTilePriority)
    });

    updateGameState("player1", 52, true);
  };

  const compareTilePriority = (a, b) => {
    return a - b;
  };

  const drawTile = () => {
    console.log(`drawing tile for ${gameState.currPlayer}`);

    const currPlayer = gameState.currPlayer;
    const currTile = gameState.currTile;

    var currentPlayersHand = players[currPlayer];

    currentPlayersHand.push(board[currTile]);

    // check if winning hand
    isHandWinning(currentPlayersHand);
    
    updateHand(currPlayer, currentPlayersHand, "draw");
  };

  const isHandWinning = (hand, pairFound = false) => {
    console.log(`checking if ${hand} is winning`);
    const currHand = [...hand];
    var remainder = [...hand];

    if (!currHand.length) {
      console.log("YOU WIN!");
      return true;
    }

    const tile = currHand.pop();
    
    console.log(`Pre-check: ${currHand}`);
    if (hasPon(tile, currHand, remainder)) {
      console.log(`Post-Pon: ${remainder}`);
      if (isHandWinning(remainder)) {
        return true;
      } else {
        remainder = [...hand];
      }
    } 
    if (hasChi(tile, currHand, remainder)) {
      console.log(`Post-Chi: ${remainder}`);
      if (isHandWinning(remainder)) {
        return true;
      } else {
        remainder = [...hand];
      }
    } 
    if (hasPair(tile, currHand, remainder, pairFound)) {
      console.log(`Post-Pair: ${remainder}`);
      if (isHandWinning(remainder)) {
        return true;
      } else {
        remainder = [...hand];
      }
    }

    return false;
  };

  const hasPon = (tile, handChunk, remainder) => {
    var newArray = handChunk.filter( value => value === tile );
    if (newArray.length >= 2) {
      console.log(`${tile} can be part of a pon!`);
      const index = remainder.indexOf(tile);
      remainder.splice(index, 3);
      return true;
    }
    
    return false;
  };

  const hasChi = (tile, handChunk, remainder) => {
    /* check if tile is character, stone, or bamboo */
    if (tile >= 1 && tile <= 29) {
      // 6 -> 4 5 6 | 5 6 7 | 6 7 8

      if (handChunk.includes(tile - 2) && handChunk.includes(tile - 1)) {
        console.log(`${tile} can be part of a chi! -2 -1`);
        const indexTileMinus2 = remainder.indexOf(tile - 2);
        remainder.splice(indexTileMinus2, 1);
        const indexTileMinus1 = remainder.indexOf(tile - 1);
        remainder.splice(indexTileMinus1, 1);
        const indexTile = remainder.indexOf(tile);
        remainder.splice(indexTile, 1);
        return true;
      }

      if (handChunk.includes(tile - 1) && handChunk.includes(tile + 1)) {
        console.log(`${tile} can be part of a chi! -1 +1`);
        const indexTileMinus1 = remainder.indexOf(tile - 1);
        remainder.splice(indexTileMinus1, 1);
        const indexTile = remainder.indexOf(tile);
        remainder.splice(indexTile, 1);
        const indexTilePlus1 = remainder.indexOf(tile + 1);
        remainder.splice(indexTilePlus1, 1);
        return true;
      }

      if (handChunk.includes(tile + 1) && handChunk.includes(tile + 2)) {
        console.log(`${tile} can be part of a chi! +1 +2`);
        const indexTile = remainder.indexOf(tile);
        remainder.splice(indexTile, 1);
        const indexTilePlus1 = remainder.indexOf(tile + 1);
        remainder.splice(indexTilePlus1, 1);
        const indexTilePlus2 = remainder.indexOf(tile + 2);
        remainder.splice(indexTilePlus2, 1);
        return true;
      }

      return false;
    }
  };

  const hasPair = (tile, handChunk, remainder, pairFound) => {
    if (pairFound) {
      /* pair already exists */
      return false;
    }

    var newArray = handChunk.filter(value => value === tile);
    
    if (newArray.length === 1) {
      console.log(`${tile} can be part of a pair!`);
      pairFound = true;
      const index = remainder.indexOf(tile);
      remainder.splice(index, 2);
      return true;
    }

    console.log(`${tile} is not part of anything`);
    return false;
  };

  const updateHand = (player, newHand, action) => {

    // TODO: need to remove this when Pon and Chi are implemented
    if (gameState.currPlayer !== player) {
      console.log(`Currently ${gameState.currPlayer}'s turn.`);
      return;
    }

    /* update the current players hand */
    var currentHands = {...players};

    if (action === "discard") {
      /* resort the hand */
      currentHands[player] = newHand.sort(compareTilePriority);

      /* get the next player, draw the next tile, update next players hand */
      const nextPlayer = findNextPlayer(player);

      /* update the game state */
      const nextTile = gameState.currTile + 1;
      updateGameState(nextPlayer, nextTile);
    }
    
    
    setPlayers(currentHands);
    
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

  const updateGameState = (player, tileIndex, started = gameState.started) => {
    console.log(`updating currPlayer to ${player}`);
    setGameState({
      started: started,
      currPlayer: player,
      currTile: tileIndex,
      realPlayers: gameState.realPlayers,
      CPUPlayers: gameState.CPUPlayers
    });
  };

  const checkWinningHand = () => {
    const hand1 = [1,2,3,4,4,5,6,7,8,8,8,9,9,9];
    const hand2 = [1,2,3,3,3,5,6,7,8,8,8,9,9,9];
    const hand3 = [1,2,3,3,3,3,5,6,7,8,8,8,9,9];
    const hand4 = [1,2,3,4,5,5,6,7,8,8,8,9,9,9];
    const hand5 = [1,2,3,3,4,5,5,5,6,6,6,7,8,9];
    // console.log(`${hand1} should be winning: RESULTS:${isHandWinning(hand1)}`);
    // console.log(`${hand2} should be winning: RESULTS:${isHandWinning(hand2)}`);
    // console.log(`${hand3} should be winning: RESULTS:${isHandWinning(hand3)}`);
    // console.log(`${hand4} should NOT be winning: RESULTS:${isHandWinning(hand4)}`);
    console.log(`${hand5} should be winning: RESULTS:${isHandWinning(hand5)}`);
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

      <button onClick={checkWinningHand}>Debug</button>
    </div>
  );
};

export default App;
