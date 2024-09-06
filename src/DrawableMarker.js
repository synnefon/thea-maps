import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { upsertMarker, deleteMarker } from './DatabaseHandler';
import Button from 'react-bootstrap/Button';
import { createIcon } from './MapIcon';


function DrawableMarker({marker, markers, setMarkers, newMarker, setNewMarker}) {
    const [description, setDescription] = useState(null)
    const markerRef = useRef()

    useEffect(() => {
        const keydownListener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter" || event.code === "Escape") {
            event.preventDefault()
            if (markerRef.current) {
                markerRef.current.closePopup()
                setNewMarker(null)
            }
          }
        };
        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, []);

    return (
        <Marker 
            key={`marker-${marker.id}`}
            ref={markerRef}
            bubblingMouseEvents={true}
            position={marker.position}
            eventHandlers={{ 
                popupclose: () => {
                    console.log("here")
                    upsertMarker(marker)
                },
                add: () => { if (newMarker && newMarker.id === marker.id && markerRef.current) { markerRef.current.openPopup()}}
            }}
            icon={createIcon(marker.icon)}
        >
            <Popup className="marker-popup"> 
                <Button 
                    className='delete-marker-button'
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

export function DrawableMarkers({markers, setMarkers, newMarker, setNewMarker}) {
    return markers.map((marker, _) => (
        <DrawableMarker 
            key={`drawable ${marker.id}`}
            marker={marker}
            markers={markers}
            setMarkers={setMarkers}
            newMarker={newMarker}
            setNewMarker={setNewMarker}
        />
    ))
} 
