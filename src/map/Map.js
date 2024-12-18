import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import { upsertMarker, fetchMarkers } from '../db/DatabaseHandler';
import { SideBar } from './SideBar'
import { DrawableMarkers } from '../markers/DrawableMarker';

import '../styles/app.css';
import '../styles/leaflet.css';

// Marker which can be placed on a map.
class MapMarker {
    constructor(id, position, description, icon) {
        this.id = id
        this.position = position
        this.description = description
        this.icon = icon
    }
}

// Create a generic Map object.
export function Map() {

    const [sidebarOpen, setSideBarOpen] = useState(true);
    const handleViewSidebar = () => setSideBarOpen(!sidebarOpen)
    const [markers, setMarkers] = useState([])
    const [newMarker, setNewMarker] = useState(null)
    const [activeIcon, setActiveIcon] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(isMobile ? 1 : 3);

    // Create an object which defined the bounds of a Leaflet map.
    const mapBounds = Leaflet.latLngBounds(
        Leaflet.latLng(52, -180), // Southwest coordinates
        Leaflet.latLng(86, 0)     // Northeast coordinates
    )

    // Function which creates location markers to be rendered on the map.
    const LocationMarkers = () => {
        return (
            <DrawableMarkers
                markers={markers}
                setMarkers={setMarkers}
                newMarker={newMarker}
                setNewMarker={setNewMarker}
                zoomLevel={zoomLevel}
            />
        )
    }

    // Function to request data for each placed marker (icon, description, etc.).
    const loadMarkersData = async () => {
        fetchMarkers().then((markersData) => {
            setMarkers(markersData.Items.map((entry) => new MapMarker(entry.id, entry.position, entry.description, entry.icon)))
        })
    }

    // Load marker data when a Map object is added to the DOM.
    useEffect(() => { loadMarkersData() }, [])

    // Define a function that creates and returns  a new MapMarker object.
    const createMarker = (latlng) => {
        if (!activeIcon) return

        const m = new MapMarker(uuidv4(), [latlng.lat, latlng.lng], "", activeIcon)
        setMarkers(markers.concat([m]))
        upsertMarker(m)
        setNewMarker(m)
    }

    // On mouse double-clicks, create a marker at the clicked location on the map.
    const RegisterMapEvents = () => {
        const mapEvents = useMapEvents({
             dblclick(e) { createMarker(e.latlng) },
             zoomend() {setZoomLevel(mapEvents.getZoom());},
        })
    }

    // Create, populate, and return the map and it's related systems.
    return (
       <div className='map'>
           <MapContainer
               center={[0, 0]} 
               zoom={zoomLevel}
               minZoom={isMobile ? 1 : 3}
               maxZoom={isMobile ? 5 : 6}
               doubleClickZoom={false}
               autoPanOnFocus={false}
               maxBounds={mapBounds}
               maxBoundsViscosity={1}
           >
               <RegisterMapEvents/>
               <TileLayer 
                   className='tile-layer'
                   url={'../mapTiles/{z}/{x}/{y}.png'}
               />
               <LocationMarkers/>
               {/* <h2>
                   <br/>
                   <ol className='instructions'>
                       <li>select marker</li>
                       <li>double-click map</li>
                   </ol>
               </h2> */}
           </MapContainer>
           <SideBar 
               isOpen={sidebarOpen} 
               toggleSidebar={handleViewSidebar}
               setActiveIcon={setActiveIcon}
           />
	</div>
    ); 
}
