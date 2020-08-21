import React from 'react';
import Tile from './Tile';
import style from './player.module.css';

const Player = props => {
    return (
        <div className={style.player}>
            <h1>{props.name}</h1>
            <div className={style.tile}>
                {props.player.map((tile, index) => {
                    var tileSplit = tile.split("-");
                    return (
                        <Tile key={index} tile={tileSplit[1]}/>
                    )
                })}
            </div>
        </div>
    )
};

export default Player;