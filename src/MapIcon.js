import L from 'leaflet';
import red from './assets/red-marker.svg'
import yellow from './assets/yellow-marker.svg'
import purple from './assets/purple-marker.svg'


export const Colors = Object.freeze({
    RED:   "red",
    YELLOW:  "yellow",
    PURPLE: "purple"
});

export const getColorSvg = (color) => {
    return  {
        [Colors.RED]: red,
        [Colors.YELLOW]: yellow,
        [Colors.PURPLE]: purple
    }[color]
}

export const createIcon = (color = Colors.RED) => {
    const colorsvg = getColorSvg(color)

    return new L.Icon({
        iconUrl: colorsvg,
        iconRetinaUrl: colorsvg,
        popupAnchor:  [0, 0],
        iconAnchor: [15, 40],
        iconSize: [32,45],     
    })
}


