import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { upsertMarker, deleteMarker } from './DatabaseHandler';
import Button from 'react-bootstrap/Button';
import { createIcon } from './MapIcon';

// Create and return a Marker object for adding markers to the map viz.
function DrawableMarker({marker, removeMarker, newMarker, setNewMarker, zoomLevel}) {
    const [description, setDescription] = useState(null)
    const markerRef = useRef()

    // Keyboard shortcuts for closing this marker's pop-up window.
    useEffect(() => {
        const keydownListener = (e) => {
            if (!["Enter", "NumpadEnter", "Escape"].includes(e.code)) return
            if (!markerRef.current) return
            
            e.preventDefault()
            markerRef.current.closePopup()
            setNewMarker(null)
        }

        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, [setNewMarker])

    // Open a pop-up window for this marker. 
    const openPopup = () => {
        if (newMarker && newMarker.id === marker.id && markerRef.current) { 
            markerRef.current.openPopup()
        }
    }

    // Create and return the Marker object.
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
            icon={createIcon(marker.icon, zoomLevel)}
        >
	    // Marker delete button
            <Popup className="marker-popup"> 
                <Button 
                    className='delete-mark/er-button'
                    onClick={(e) => {
                        removeMarker(marker)
                        deleteMarker(marker)
                        e.stopPropagation()
                    }}
                >
                    DELETE
                </Button>
                <br/> <br/>
	        // Marker name input text field.
                <input
                    className = "popup-input"
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

// Public interface to create and return a DrawableMarker object, for the map viz.
export function DrawableMarkers({markers, setMarkers, newMarker, setNewMarker, zoomLevel}) {
    const removeMarker = (marker) => setMarkers(markers.filter((m) => m.id !== marker.id))
    
    return markers.map((marker, _) => (
        <DrawableMarker 
            key={`drawable ${marker.id}`}
            marker={marker}
            removeMarker={removeMarker}
            newMarker={newMarker}
            setNewMarker={setNewMarker}
            zoomLevel={zoomLevel}
        />
    ))
} 
