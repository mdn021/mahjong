import React from 'react';
import Tile from './Tile';
import style from './player.module.css';

const Player = props => {
    const discard = tile => {
        const newHand = props.hand;
        const index = newHand.indexOf(tile);
        if (index !== -1){
            newHand.splice(index, 1);
        }
        props.onClick(props.index, newHand, "discard");
    };

    return (
        <div className={style.player}>
            <h1>{props.name}</h1>
            <div className={style.tile}>
                {props.hand.map((tile, index) => {
                    return (
                        <Tile key={index} tile={tile} player={props.name} onClick={discard}/>
                    )
                })}
            </div>
        </div>
    )
};

export default Player;