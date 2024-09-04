import React, { useState, useEffect } from 'react';
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

export function Map() {
    const [markers, setMarkers] = useState([])
    const [activeColor, setActiveColor] = useState(Colors.RED)

    const loadMarkersData = async () => {
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.color)))
        })
    }

    const DrawableMarker = (marker) => {
        const handlePopupClose = () => upsertMarker(marker)
        const [description, setDescription] = useState(null)

        return (
            <Marker 
                key={`marker-${marker.id}`}
                position={marker.position}
                eventHandlers={{popupclose: handlePopupClose}}
                icon={createIcon(marker.color)}
            >
                <Popup > 
                    <Button 
                        onClick={function(e) {
                            setMarkers(markers.filter((m) => m.id !== marker.id))
                            deleteMarker(marker)
                            e.stopPropagation()
                        }}
                    >
                        DELETE
                    </Button>
                    <br/>
                    <br/>
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
    }, []);
        
    return (
        <div>
            <MapContainer
                center={[75, -95]} 
                zoom={3}
                tap={true}
                minZoom={3}
                maxZoom={6}
                doubleClickZoom={false}
                style={{"textCenter": true}}
                autoPanOnFocus={false}
            >
                <h1 className='instructions'>
                    DOUBLE-CLICK TO ADD A MARKER
                </h1>
                <TileLayer 
                    url={'../althea/{z}/{x}/{y}.png'}/>
                <LocationMarkers/>
                <IconSelector handleSelectedColor={(color) => setActiveColor(color)}/>
            </MapContainer>
        </div>
    ); 
  }
