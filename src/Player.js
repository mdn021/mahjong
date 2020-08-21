import React from 'react';
import Tile from './Tile';
import style from './player.module.css';

const Player = props => {
    return (
        <div className={style.player}>
            <h1>{props.name}</h1>
            <div className={style.tile}>
                {props.player.map((tile, index) => {
                    return (
                        <Tile key={index} tile={tile}/>
                    )
                })}
            </div>
        </div>
    )
};

export default Player;