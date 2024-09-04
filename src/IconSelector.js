import { useState } from 'react';
import {isMobile} from 'react-device-detect';
import Control from 'react-leaflet-custom-control'
import Button from 'react-bootstrap/Button';
import { Icons, getIconSvg } from './MapIcon';
import './style.css';

const choosableIcons = [
    // Icons.RED,
    // Icons.YELLOW,
    // Icons.PURPLE,
    Icons.ALERT,
    Icons.HOUSE,
    Icons.MONEY,
    Icons.PERSON,
    Icons.FLAG
]


function MakeButton(icon, handleSelectedIcon, selectedIcon, setSelectedIcon) {
    const buttonSize = isMobile ? 50 : 100

    return (
        <div 
            className={`${isMobile ? '' : 'marker-wrapper'}`}
            style = {{ 'width': `${buttonSize}px` }}
            key={icon.toString()}
        >
            <Button 
                key={icon.toString()}
                className={`marker-button ${selectedIcon === icon? 'active-icon' : ''}`}
                onClick={() => {
                    if (selectedIcon !== icon) {
                        setSelectedIcon(icon)
                        handleSelectedIcon(icon)
                    } else {
                        handleSelectedIcon(null)
                        setSelectedIcon(null)
                    }
                }}
            > 
                <img 
                    className='icon-image'
                    src={getIconSvg(icon)}
                    alt={`${icon} marker selector button`}
                />
            </Button> 
        </div>
    )
}

export function IconSelector({handleSelectedIcon}) {
    const [selectedIcon, setSelectedIcon] = useState(Icons.RED)
    return (
        <Control 
            position='bottomleft'
            className='marker-menu'
        >
            {!isMobile && <h1 className='instructions'> &nbsp;DOUBLE-CLICK TO ADD A MARKER</h1>}
            {choosableIcons.map((icon) => MakeButton(icon, handleSelectedIcon, selectedIcon, setSelectedIcon))}
            {isMobile && <h2 className='instructions mobile'> DOUBLE-CLICK TO ADD A MARKER</h2>}
            {isMobile && <div><br/><br/><br/><br/><br/></div>}
        </Control>
    )
}
