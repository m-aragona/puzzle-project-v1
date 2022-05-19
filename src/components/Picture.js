import black_frame from '../assets/black_frame.png';
import black_part from '../assets/negro.png'

import React, { useState, useEffect, useContext } from "react"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import DragItem from "./DragItem";
import { Grid, GridImage, GridItem } from "./Grid";
import GridContext from "./GridContext";
import { GridProvider } from "./GridContext";
import { IMAGES } from '../Images2';

const Picture = ({ tokenId }) => {
    const { items, moveItem } = useContext(GridContext);

    return (

        <main className="images">
            <div style={{
                position: 'relative', display: 'flex', justifyContent: 'center',
                alignItems: 'center', margin: 'auto'
            }}>
                <img alt="framePuzzle" style={{
                    position: 'relative', display: 'flex'
                }} src={black_frame}>
                </img>


                <div style={{
                    width: 500, height: 500, fontSize: 0, position: 'absolute'
                }}>




                    <Grid>
                        {items.map(item => (
                            <DragItem key={item.id} id={item.id} onMoveItem={moveItem}>
                                <GridItem>
                                    <GridImage src={require('../assets/Pictures/' + item.src + '.png')}></GridImage>
                                </GridItem>
                            </DragItem>
                        ))}
                    </Grid>




                    {/* {IMAGES.map(image => (
                        <img key={image.id}
                            src={tokenId >= image.reveal ? require('../assets/Pictures/' +
                                image.url +
                                '.png') : black_part}
                            style={{ width: '100px', height: '100px' }} alt="imgPuzzle" />
                    ))}  */}

                </div>


            </div>
        </main>

    )
}

export default Picture;