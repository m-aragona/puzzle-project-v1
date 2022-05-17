import black_frame from '../assets/black_frame.png';
import black_part from '../assets/negro.png'
import { IMAGES } from '../Images2';
import React, { useState, useEffect } from "react"

const Picture = ({ tokenId }) => {
    // const [imgsLoaded, setImgsLoaded] = useState(false)

    // useEffect(() => {
    //     const loadImage = image => {
    //         return new Promise((resolve, reject) => {
    //             const loadImg = new Image()
    //             loadImg.src = image.url
    //             // wait 2 seconds to simulate loading time
    //             loadImg.onload = () =>
    //                 setTimeout(() => {
    //                     resolve(image.url)
    //                 }, 2000)

    //             loadImg.onerror = err => reject(err)
    //         })
    //     }

    //     Promise.all(IMAGES.map(image => loadImage(image)))
    //         .then(() => setImgsLoaded(true))
    //         .catch(err => console.log("Failed to load images", err))
    // }, [])



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

                    {IMAGES.map(image => (
                        <img key={image.id}
                            src={tokenId >= image.reveal ? require('../assets/Pictures/' +
                                image.url +
                                '.png') : black_part}
                            style={{ width: '100px', height: '100px' }} alt="imgPuzzle" />
                    ))}


                    {/* {IMAGES.map((item, index) => (
                        <Box key={index} className="col-sm-12">
                            <img
                                src={require('../../../assets/images/website/homepage/' +
                                    item.image +
                                    '.png')}
                                className="img-fluid"
                                alt={item.title}
                            />
                            <Typography variant="h4">{item.number}</Typography>
                        </Box>
                    ))} */}



                    {/* {imgsLoaded ? (
                        IMAGES.map(image => (
                            <img onError={(e) => (e.target.onerror = null, e.target.src = black_part)} key={image.id}
                                src={tokenId >= image.reveal ? image.url : black_part} style={{ width: '100px', height: '100px' }} alt="imgPuzzle" />
                        ))
                    ) : (
                        <h1>Loading images...</h1>                       
                    )} */}


                </div>
            </div>
        </main>

    )
}

export default Picture;