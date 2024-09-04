import { useState } from 'react';
import Control from 'react-leaflet-custom-control'
import Button from 'react-bootstrap/Button';
import { Colors, getColorSvg } from './MapIcon';
import './style.css';


export function IconSelector({handleSelectedColor}) {
    const [selectedColor, setSelectedColor] = useState(Colors.RED)

    return (
        <Control prepend position='bottomleft'>
            {[Colors.RED, Colors.YELLOW, Colors.PURPLE].map((color) => {
                return (
                    <Button 
                        key={color.toString()}
                        className={`marker-menu ${selectedColor === color? 'active-color' : ''}`}
                        onClick={() => {
                            setSelectedColor(color)
                            handleSelectedColor(color)
                        }}
                    > 
                        <img 
                            src={getColorSvg(color)}
                            height={100}
                            width={100}
                            alt={`${color} marker selector button`}
                        />
                    </Button> 
                )
            })}
        </Control>
    )
}
