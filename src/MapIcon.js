import L from 'leaflet';
import person from './assets/person-half.svg'
import alert from './assets/alert.svg'
import house from './assets/house.svg'
import money from './assets/money-bag.svg'
import farmers from './assets/farmers.svg'
import church from './assets/church.svg'
import merchants from './assets/merchants.svg'
import thieves from './assets/thieves.svg'
import players from './assets/red-marker.svg'


export const Icons = Object.freeze({
    PERSON: "person",
    ALERT: "alert",
    HOUSE: "house",
    MONEY: "money",
    FARMERS: "farmers",
    CHURCH: "church",
    MERCHANTS: "merchants",
    THIEVES: "thieves",
    PLAYERS: "players"
});

export const getIconSvg = (icon) => {
    return  {
        [Icons.PERSON]: person,
        [Icons.ALERT]: alert,
        [Icons.HOUSE]: house,
        [Icons.MONEY]: money,
        [Icons.FARMERS]: farmers,
        [Icons.CHURCH]: church,
        [Icons.MERCHANTS]: merchants,
        [Icons.THIEVES]: thieves,
        [Icons.PLAYERS]: players
    }[icon]
}

export const createIcon = (icon = Icons.RED) => {
    const iconvg = getIconSvg(icon)

    return new L.Icon({
        iconUrl: iconvg,
        iconRetinaUrl: iconvg,
        popupAnchor:  [0, 0],
        iconAnchor: [19, 17],
        iconSize: [35,35],     
    })
}


