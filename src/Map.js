import React, { useState, useEffect } from 'react';
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

    const initialZoom = isMobile ? 1 : 3
    const minZoom = isMobile ? 1 : 3
    const maxZoom = isMobile ? 5 : 6
        
    return (
        <div>
            <MapContainer
                center={[75, -95]} 
                zoom={initialZoom}
                tap={true}
                minZoom={minZoom}
                maxZoom={maxZoom}
                doubleClickZoom={false}
                style={{"textCenter": true}}
                autoPanOnFocus={false}
            >
                {
                    isMobile ? 
                        <h2 className='instructions mobile'> DOUBLE-CLICK TO ADD A MARKER</h2> :
                        <h1 className='instructions'> DOUBLE-CLICK TO ADD A MARKER</h1>
                }
                <TileLayer 
                    url={'../althea/{z}/{x}/{y}.png'}/>
                <LocationMarkers/>
                <IconSelector handleSelectedColor={(color) => setActiveColor(color)}/>
            </MapContainer>
        </div>
    ); 
  }
