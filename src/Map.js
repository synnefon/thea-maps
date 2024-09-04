import React, { useState, useEffect, useCallback } from 'react';
import {isMobile} from 'react-device-detect';
import Button from 'react-bootstrap/Button';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { upsertMarker, fetchMarkers, deleteMarker } from './DatabaseHandler';
import { createIcon, Colors } from './MapIcon';
import { IconSelector } from './IconSelector';

import './style.css';


class MapMarker {
    constructor(id, position, description, color) {
        this.id = id
        this.position = position
        this.description = description
        this.color = color
    }
}

// const interval = (delay = 0) => callback =>
//     useEffect(() => {
//       const id = setInterval(callback, delay);
  
//       return () => clearInterval(id);
// }, [callback]);


export function Map() {
    const [markers, setMarkers] = useState([])
    const [activeColor, setActiveColor] = useState(Colors.RED)
    // const [timerRunning, setTimerRunning] = useState(false)
    // const pauseTimer = () => setTimerRunning(false)
    // const startTimer = () => setTimerRunning(true);
        
    const loadMarkersData = async () => {
        // console.log(document.querySelector('.leaflet-popup-content'))
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.color)))
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
                icon={createIcon(marker.color)}
            >
                <Popup
                    closeOnClick={false}
                    autoClose={false}
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
                const position = [e.latlng.lat, e.latlng.lng]
                const newMarker = new MapMarker(uuidv4(), position, "", activeColor)
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
                <IconSelector handleSelectedColor={(color) => setActiveColor(color)}/>
                <LocationMarkers/>
            </MapContainer>
        </div>
    ); 
  }
