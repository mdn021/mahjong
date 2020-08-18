import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(() => {
    const defaultBoard = [];

    for (var a = 0; a < 4; a++) {
      /* add number tiles */
      var i, j, k;
      i = j = k = 0;

      /* characters tiles */
      while (i < 9) {
        defaultBoard.push(`${i + 1}c`);
        i++;
      }

      /* stone tiles */
      while (j < 9) {
        defaultBoard.push(`${j + 1}s`);
        j++;
      }
      
      /* bamboo tiles */
      while (k < 9) {
        defaultBoard.push(`${k + 1}b`);
        k++;
      }

      /* add wind tiles */
      defaultBoard.push('east', 'south', 'west', 'north');

      /* add dragons */
      defaultBoard.push('red', 'white', 'green');
    }
    
    return defaultBoard;
  });

  useEffect( () => {
    console.log({board});
  })

  return(
    <div className="App">
      {board}
    </div>
  );
};

export default App;
