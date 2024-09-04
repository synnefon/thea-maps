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
        <Control position='bottomleft'>
            {[Colors.RED, Colors.YELLOW, Colors.PURPLE].map((color) => {
                return (
                    <div style = {{ 'width': `${buttonSize}px` }} key={color.toString()}>
                    <Button 
                        
                        key={color.toString()}
                        className={`marker-menu ${selectedColor === color? 'active-color' : ''}`}
                        onClick={() => {
                            setSelectedColor(color)
                            handleSelectedColor(color)
                        }}
                    > 
                        <img 
                            className='icon-image'
                            src={getColorSvg(color)}
                            // height={buttonSize}
                            // width={buttonSize}
                            alt={`${color} marker selector button`}
                        />
                    </Button> 
                    <br/>
                    </div>
                )
            })}
            {isMobile && <br/>}
        </Control>
    )
}
