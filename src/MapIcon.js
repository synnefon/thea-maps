import L from 'leaflet';
import red from './assets/red-marker.svg'
import yellow from './assets/yellow-marker.svg'
import purple from './assets/purple-marker.svg'

import smile from './assets/smile.svg'
import person from './assets/person-half.svg'
import alert from './assets/alert.svg'
import house from './assets/house.svg'
import money from './assets/money-bag.svg'
import flag from './assets/flag.svg'


export const Icons = Object.freeze({
    RED:   "red",
    YELLOW:  "yellow",
    PURPLE: "purple",
    SMILE: "smile",
    PERSON: "person",
    ALERT: "alert",
    HOUSE: "house",
    MONEY: "money",
    FLAG: "flag",
});

export const getIconSvg = (icon) => {
    return  {
        [Icons.RED]: red,
        [Icons.YELLOW]: yellow,
        [Icons.PURPLE]: purple,
        [Icons.SMILE]: smile,
        [Icons.PERSON]: person,
        [Icons.ALERT]: alert,
        [Icons.HOUSE]: house,
        [Icons.MONEY]: money,
        [Icons.FLAG]: flag
    }[icon]
}

export const createIcon = (icon = Icons.RED) => {
    const iconvg = getIconSvg(icon)

    return new L.Icon({
        iconUrl: iconvg,
        iconRetinaUrl: iconvg,
        popupAnchor:  [0, 0],
        iconAnchor: [20, 23],
        iconSize: [35,45],     
    })
}


