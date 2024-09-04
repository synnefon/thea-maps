import { useState } from 'react';
import {isMobile} from 'react-device-detect';
import Control from 'react-leaflet-custom-control'
import Button from 'react-bootstrap/Button';
import { Colors, getColorSvg } from './MapIcon';
import './style.css';


export function IconSelector({handleSelectedColor}) {
    const [selectedColor, setSelectedColor] = useState(Colors.RED)
    const buttonSize = isMobile ? 50 : 100

    return (
        <Control 
            position='bottomleft'
            className='marker-menu'
        >
            {!isMobile && <h2 className='instructions'> &nbsp;DOUBLE-CLICK TO ADD A MARKER</h2>}
            {[Colors.RED, Colors.YELLOW, Colors.PURPLE].map((color) => {
                return (
                    <div 
                        className={`${isMobile ? '' : 'marker-wrapper'}`}
                        style = {{ 'width': `${buttonSize}px` }}
                        key={color.toString()}
                    >
                        <Button 
                            key={color.toString()}
                            className={`marker-button ${selectedColor === color? 'active-color' : ''}`}
                            onClick={() => {
                                setSelectedColor(color)
                                handleSelectedColor(color)
                            }}
                        > 
                            <img 
                                className='icon-image'
                                src={getColorSvg(color)}
                                alt={`${color} marker selector button`}
                            />
                        </Button> 
                    </div>
                )
            })}
            {isMobile && <h2 className='instructions mobile'> DOUBLE-CLICK TO ADD A MARKER</h2>}
            {isMobile && <br/>}
        </Control>
    )
}
