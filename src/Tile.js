import React from 'react';
import style from './tile.module.css';
import {TileMap} from './Constants';

const Tile = ({tile}) => {
    return(
        <div className={style.tile}>
            <p>{tile}</p>
        </div>
    );
};

export default Tile;