import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { upsertMarker, fetchMarkers } from './DatabaseHandler';
import { SideBar } from './SideBar'
import { DrawableMarkers } from './DrawableMarker';

import './style.css';


class MapMarker {
    constructor(id, position, description, icon, isNew=false) {
        this.id = id
        this.position = position
        this.description = description
        this.icon = icon
        this.isNew = isNew
    }
}

export function Map() {
    const [sidebarOpen, setSideBarOpen] = useState(true);
    const handleViewSidebar = () => setSideBarOpen(!sidebarOpen)
    const [markers, setMarkers] = useState([])
    const [activeIcon, setActiveIcon] = useState(null)
        
    const loadMarkersData = async () => {
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.icon)))
        })
    }

    const mapBounds = Leaflet.latLngBounds(
        Leaflet.latLng(52, -180), // Southwest coordinates
        Leaflet.latLng(86, 0) // Northeast coordinates
    )

    const LocationMarkers = () => {
        useMapEvents({
            dblclick(e) {
                if (!activeIcon) return

                const newMarker = new MapMarker(uuidv4(), [e.latlng.lat, e.latlng.lng], "", activeIcon, true)
                setMarkers(markers.concat([newMarker]))
                upsertMarker(newMarker)
            }
        })

        return <DrawableMarkers markers={markers} setMarkers={setMarkers}/>
    }

    useEffect(() => { loadMarkersData() }, []);

    return (
        <div className='map'>
            <MapContainer
                center={[0, 0]} 
                zoom={isMobile ? 1 : 3}
                minZoom={isMobile ? 1 : 3}
                maxZoom={isMobile ? 5 : 6}
                doubleClickZoom={false}
                autoPanOnFocus={false}
                maxBounds={mapBounds}
                maxBoundsViscosity={1.0}
            >
                <TileLayer url={'../althea/{z}/{x}/{y}.png'}/>
                <LocationMarkers/>
            </MapContainer>
            <SideBar 
                isOpen={sidebarOpen} 
                toggleSidebar={handleViewSidebar}
                setActiveIcon={setActiveIcon}
            />
        </div>
    ); 
  }
