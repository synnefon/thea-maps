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
    constructor(id, position, description, icon) {
        this.id = id
        this.position = position
        this.description = description
        this.icon = icon
    }
}

export function Map() {
    const [sidebarOpen, setSideBarOpen] = useState(true);
    const handleViewSidebar = () => setSideBarOpen(!sidebarOpen)
    const [markers, setMarkers] = useState([])
    const [newMarker, setNewMarker] = useState(null)
    const [activeIcon, setActiveIcon] = useState(null)

    const mapBounds = Leaflet.latLngBounds(
        Leaflet.latLng(52, -180), // Southwest coordinates
        Leaflet.latLng(86, 0) // Northeast coordinates
    )

    const LocationMarkers = () => {
        return (
            <DrawableMarkers
                markers={markers}
                setMarkers={setMarkers}
                newMarker={newMarker}
                setNewMarker={setNewMarker}
            />
        )
    }

    const loadMarkersData = async () => {
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.icon)))
        })
    }

    useEffect(() => { loadMarkersData() }, [])

    const createMarker = (latlng) => {
        if (!activeIcon) return

        const m = new MapMarker(uuidv4(), [latlng.lat, latlng.lng], "", activeIcon)
        setMarkers(markers.concat([m]))
        upsertMarker(m)
        setNewMarker(m)
    }

    const RegisterMapEvents = () => {
        useMapEvents({ dblclick(e) { createMarker(e.latlng) }})
    }

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
                maxBoundsViscosity={1}
            >
                <RegisterMapEvents/>
                <TileLayer url={'../althea/{z}/{x}/{y}.png'}/>
                <LocationMarkers/>
                <h2>
                    <br/>
                    <ol className='instructions'>
                        <li>select marker</li>
                        <li>double-click map</li>
                    </ol>
                </h2>
            </MapContainer>
            <SideBar 
                isOpen={sidebarOpen} 
                toggleSidebar={handleViewSidebar}
                setActiveIcon={setActiveIcon}
            />
        </div>
    ); 
}
