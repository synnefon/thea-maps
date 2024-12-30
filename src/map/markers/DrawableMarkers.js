    import React, { useState, useRef, useEffect } from 'react';
    import { Marker, Popup } from 'react-leaflet';
    import { createMarkerDB, updateMarkerDB, deleteMarkerDB } from '../../db/DatabaseHandler';
    import { createIcon } from './MarkerIcon';
    
    // Create and return a Marker object for adding markers to the map viz.
    function DrawableMarker({marker, removeMarker, updateMarker, zoomLevel, isNew}) {
        const [description, setDescription] = useState(null)
        const [originalDescription] = useState(marker.description)
        const markerRef = useRef()
    
        // Keyboard shortcuts for closing this marker's pop-up window.
        useEffect(() => {
            const keydownListener = (e) => {
                if (!["Enter", "NumpadEnter", "Escape"].includes(e.code)) return
                if (!markerRef.current) return
                
                e.preventDefault()
                e.stopPropagation()
                markerRef.current.closePopup()
            }
    
            document.addEventListener("keydown", keydownListener);
            return () => document.removeEventListener("keydown", keydownListener);
        }, [])
    
        // Open a pop-up window containing details about this marker.
        const onAddMarker = () => { 
            if (isNew) {
                markerRef.current.openPopup()
            }
        }

        const onClosePopup = (marker) => {
            if (marker.isNew) {
                marker.isNew = false
                updateMarker(marker)
                createMarkerDB(marker)
            } 
            if (originalDescription !== marker.description) {
                updateMarkerDB(marker)
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
                    add: onAddMarker,
                    popupclose: () => onClosePopup(marker),
                }}
                icon={createIcon(marker.icon, zoomLevel)}
            >
            {/* Marker delete button */}
                <Popup 
                    className="marker-popup"
                    bubblingMouseEvents={true}
                > 
                    <div
                        className='delete-marker-button'
                        onClick={(e) => {
                            removeMarker(marker)
                            deleteMarkerDB(marker)
                            e.stopPropagation()
                        }}
                    >
                        DELETE
                    </div>
                    <br/> <br/>
                {/* Marker name input text field. */}
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
    export function DrawableMarkers({markers, removeMarker, updateMarker, zoomLevel}) {   
        return markers.map((marker, _) => 
            <DrawableMarker 
                key={`drawable ${marker.id}`}
                marker={marker}
                removeMarker={removeMarker}
                updateMarker={updateMarker}
                zoomLevel={zoomLevel}
                isNew={marker.isNew}
            />
        )
    } 