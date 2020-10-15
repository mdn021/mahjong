import React from 'react';
import style from './tile.module.css';
import {TileMap, TileImgMap} from '../Constants';

const Tile = (props) => {

    const tileName = TileMap[props.tile];
    const tileImg = TileImgMap[props.tile];

    const discard = () => {
        props.onClick(props.tile);
    };

    if (!props.player) {
        return(
            <div className={style.tile}>
                <p>{tileName}</p>
                <img src={tileImg} alt=""/>
            </div>
        );
    } else {
        return (
            <div className={style.tile} onClick={discard}>
                <p>{tileName}</p>
                <img src={tileImg} alt="" />
            </div>
        );
    }
};

export default Tile;