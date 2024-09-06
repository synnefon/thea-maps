import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Icons, getIconSvg } from './MapIcon';
import './style.css';

const choosableIcons = [
    [Icons.FARMERS, "Farmers"],
    [Icons.CHURCH, "Church"],
    [Icons.MERCHANTS, "Merchants"],
    [Icons.THIEVES, "Thieves"],
    // [Icons.PLAYERS, "Players"],
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
            <ol>
                <li className='instructions'>select marker</li>
                <li className='instructions'>double-click map</li>
            </ol>
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
