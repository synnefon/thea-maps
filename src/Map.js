import React, { useState, useEffect } from 'react';
import {isMobile} from 'react-device-detect';
import Button from 'react-bootstrap/Button';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { upsertMarker, fetchMarkers, deleteMarker } from './DatabaseHandler';
import { createIcon } from './MapIcon';
import { IconSelector } from './IconSelector';

import './style.css';


class MapMarker {
    constructor(id, position, description, icon) {
        this.id = id
        this.position = position
        this.description = description
        this.icon = icon
    }
}

// const interval = (delay = 0) => callback =>
//     useEffect(() => {
//       const id = setInterval(callback, delay);
  
//       return () => clearInterval(id);
// }, [callback]);


export function Map() {
    const [markers, setMarkers] = useState([])
    const [activeIcon, setActiveIcon] = useState(null)
    // const [timerRunning, setTimerRunning] = useState(false)
    // const pauseTimer = () => setTimerRunning(false)
    // const startTimer = () => setTimerRunning(true);
        
    const loadMarkersData = async () => {
        // console.log(document.querySelector('.leaflet-popup-content'))
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.icon)))
        })
    }

    // const tick = useCallback(
    //     async () => timerRunning ? loadMarkersData() : undefined,
    //     [timerRunning]
    // );
    // interval(1000)(tick);


    const DrawableMarker = (marker) => {
        const [description, setDescription] = useState(null)

        return (
            <Marker 
                key={`marker-${marker.id}`}
                bubblingMouseEvents={true}
                position={marker.position}
                eventHandlers={{
                    popupclose: function() {
                        console.log("closing")
                        upsertMarker(marker)
                        // startTimer()
                    },
                    // click: (e) => {
                    //     pauseTimer()
                    //     console.log(e)
                    // }
                }}
                icon={createIcon(marker.icon)}
            >
                <Popup
                    onOpen={(e) => {
                        console.log(e)
                        // pauseTimer()
                    }}
                > 
                    <Button 
                        onClick={function(e) {
                            setMarkers(markers.filter((m) => m.id !== marker.id))
                            deleteMarker(marker)
                            e.stopPropagation()
                        }}
                    >
                        DELETE
                    </Button>
                    <br/> <br/>
                    <input
                        id={`form - ${marker.id}`}
                        type='text' 
                        value={description || marker.description}
                        onChange={(e) => {
                            marker.description = e.target.value
                            setDescription(e.target.value)
                        }}
                    />
                    <br/>
                </Popup>
            </Marker>
        )
    } 

    const LocationMarkers = () => {
        useMapEvents({
            dblclick(e) {
                if (!activeIcon) return

                const position = [e.latlng.lat, e.latlng.lng]
                const newMarker = new MapMarker(uuidv4(), position, "", activeIcon)
                setMarkers(markers.concat([newMarker]))
                upsertMarker(newMarker)
            },
        })

        return markers.map((marker, _) => DrawableMarker(marker))
    }

    useEffect(() => { 
        loadMarkersData() 
        // startTimer()
    }, []);

    return (
        <div>
            <MapContainer
                center={[75, -95]} 
                zoom={isMobile ? 1 : 3}
                minZoom={isMobile ? 1 : 3}
                maxZoom={isMobile ? 5 : 6}
                doubleClickZoom={false}
                autoPanOnFocus={false}
            >
                <TileLayer url={'../althea/{z}/{x}/{y}.png'}/>
                <IconSelector handleSelectedIcon={(icon) => setActiveIcon(icon)}/>
                <LocationMarkers/>
            </MapContainer>
        </div>
    ); 
  }
