import React from 'react';
import style from './tile.module.css';
import {TileMap} from './Constants';

const Tile = (props) => {

    const tileName = TileMap[props.tile];

    const discard = () => {
        props.onClick(props.tile);
    };

    if (!props.player) {
        return(
            <div className={style.tile}>
                <p>{tileName}</p>
            </div>
        );
    } else {
        return (
            <div className={style.tile} onClick={discard}>
                <p>{tileName}</p>
            </div>
        );
    }
};

export default Tile;