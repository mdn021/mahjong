import React from 'react';
import Tile from '../Tile/Tile';
import style from './board.module.css';

const Board = (props) => {

    const shuffle = () => {
        var newBoard = [...props.board];

        console.log(`shuffling`);
        var currentIndex = newBoard.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = newBoard[currentIndex];
            newBoard[currentIndex] = newBoard[randomIndex];
            newBoard[randomIndex] = temporaryValue;
        }

        props.onClick(newBoard);
    }

    return (
        <div className={style.board}>
            <button onClick={shuffle}>Randomize Board</button>
            {props.board.map((tile, index) => {
                return (
                    <Tile key={index} tile={tile} />
                )
            })}
        </div>
    )
};

export default Board;