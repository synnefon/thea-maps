import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { upsertMarker, deleteMarker } from './DatabaseHandler';
import Button from 'react-bootstrap/Button';
import { createIcon } from './MapIcon';


function DrawableMarker({marker, addMarker, newMarker, setNewMarker}) {
    const [description, setDescription] = useState(null)
    const markerRef = useRef()

    useEffect(() => {
        const keydownListener = event => {
            if (!["Enter", "NumpadEnter", "Escape"].includes(event.code)) return
            if (!markerRef.current) return
            
            event.preventDefault()
            markerRef.current.closePopup()
            setNewMarker(null)
        }

        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, [setNewMarker])

    const openPopup = () => {
        if (newMarker && newMarker.id === marker.id && markerRef.current) { 
            markerRef.current.openPopup()
        }
    }

    return (
        <Marker 
            key={`marker-${marker.id}`}
            ref={markerRef}
            bubblingMouseEvents={true}
            position={marker.position}
            eventHandlers={{ 
                popupclose: () => upsertMarker(marker),
                add: openPopup
            }}
            icon={createIcon(marker.icon)}
        >
            <Popup className="marker-popup"> 
                <Button 
                    className='delete-marker-button'
                    onClick={(e) => {
                        addMarker(marker)
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
    const addMarker = (marker) => setMarkers(markers.filter((m) => m.id !== marker.id))
    
    return markers.map((marker, _) => (
        <DrawableMarker 
            key={`drawable ${marker.id}`}
            marker={marker}
            addMarker={addMarker}
            newMarker={newMarker}
            setNewMarker={setNewMarker}
        />
    ))
} 
