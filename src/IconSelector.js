import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Icons, getIconSvg } from './MapIcon';
import './style.css';

const choosableIcons = [
    [Icons.FARMERS, "Farmers"],
    [Icons.CHURCH, "Church"],
    [Icons.MERCHANTS, "Merchants"],
    [Icons.THIEVES, "Thieves"],
    [Icons.ALERT, "???"],
    [Icons.MONEY, "Store"],
    [Icons.PERSON, "NPC"],
]


function MakeButton(icon, description, handleSelectedIcon, selectedIcon, setSelectedIcon) {
    return (
        <tr key={`tr - ${icon.toString()}`}>
            <td
                className='marker-wrapper'
                key={`td - ${icon.toString()}`}
            >
                <Button 
                    key={`button - ${icon.toString()}`}
                    className={`marker-button ${selectedIcon === icon? 'active-icon' : ''}`}
                    onClick={() => {
                        const newIcon = selectedIcon !== icon ? icon : null
                        setSelectedIcon(newIcon)
                        handleSelectedIcon(newIcon)
                    }}
                > 
                    <img 
                        className='icon-image'
                        src={getIconSvg(icon)}
                        alt={`${icon} marker selector button`}
                    />
                    <h4 className='marker-description'>{description}</h4>
                </Button> 
            </td>
        </tr>
    )
}

export function IconSelector({handleSelectedIcon}) {
    const [selectedIcon, setSelectedIcon] = useState(Icons.RED)
    return (
        <span>
            <table className='icon-selector-table'>
                <colgroup>
                    <col />
                </colgroup>
                <tbody>
                    {choosableIcons.map(([icon, description]) => MakeButton(icon, description, handleSelectedIcon, selectedIcon, setSelectedIcon))}
                </tbody>
            </table>
        </span>
    )
}
