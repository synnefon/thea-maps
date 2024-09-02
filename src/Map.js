import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import './Map.css';

class MapMarker {
    constructor(id, position, description) {
        this.id = id
        this.position = position
        this.description = description
    }
}

export function Map() {
    const [markers, setMarkers] = useState([])

    const DrawableMarker = (marker) => {
        return <Marker key={`marker-${marker.id}`} position={marker.position}>
            <Popup> 
                <Button 
                    onClick={function(e) {
                        setMarkers(markers.filter((m) => m.id != marker.id))
                        e.stopPropagation()
                    }}
                >
                    DELETE
                </Button>
                <br/><br/>
                <input 
                    type = 'text' 
                    onChange={(e) => marker.description = e.target.value}
                />
                <br/>
            </Popup>
        </Marker>
    } 

     const LocationMarkers = () => {
        useMapEvents({
          click(e) {
            console.log(e)
            const position = [e.latlng.lat, e.latlng.lng]
            setMarkers(markers.concat([new MapMarker(uuidv4(), position, "")]))
          },
        })
        return (
            markers.map((marker, idx) => DrawableMarker(marker))
        )
      }
  
    
    return (
        <MapContainer
            center={[75, -60]} 
            zoom={3}
            tap={true}
            minZoom={2}
        >
            <TileLayer url={'../althea/{z}/{x}/{y}.png'}/>
            <LocationMarkers/>
        </MapContainer>
    ); 
  }
