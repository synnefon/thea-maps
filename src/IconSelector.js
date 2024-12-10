import React from 'react';
import { useState } from 'react';
import { Icons, getIconSvg } from './MapIcon';

import './style.css';

// Icons which can be selected.
const choosableIcons = [
    [Icons.FARMERS, "Farmers"],
    [Icons.CHURCH, "Church"],
    [Icons.MERCHANTS, "Merchants"],
    [Icons.THIEVES, "Thieves"],
    [Icons.ALERT, "???"],
    [Icons.MONEY, "Store"],
    [Icons.PERSON, "NPC"],
]

// Create and return a button object as a table row containing a Button object within a table data.
// TODO: Table rows are crazy.  Don't use those.  Surprisingly, I really enjoy HTML/CSS programming;
// this styling might just be my first action item.
function MakeButton(icon, description, handleSelectedIcon, selectedIcon, setSelectedIcon) {
    return (
        <tr key={`tr - ${icon.toString()}`}>
            <td
                className={`marker-wrapper${selectedIcon === icon? ' marker-active' : ''}`}
                key={`td - ${icon.toString()}`}
                onClick={
                    () => {
                        const newIcon = selectedIcon !== icon ? icon : null
                        setSelectedIcon(newIcon)
                        handleSelectedIcon(newIcon)
                    }
                }
            >
                <img 
                    className={`icon-image`}
                    src={getIconSvg(icon)}
                    alt={`${icon} marker selector button`}
                ></img>
                <h4 className='marker-description'>{description}</h4>
            </td>
        </tr>
    )
}

// Public interface for creating an IconSelector menu.
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
