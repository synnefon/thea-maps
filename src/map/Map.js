import React, { useState, useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { fetchMarkers, deleteMarkerSubscription, updateMarkerSubscription, createMarkerSubscription } from '../db/DatabaseHandler';
import { SideBar } from './SideBar'
import { DrawableMarkers } from './markers/DrawableMarkers';

import '../styles/app.css';
import '../styles/leaflet.css';

// Marker which can be placed on a map.
class MapMarker {
    constructor(id, position, description, icon, isNew=false) {
        this.id = id
        this.position = position
        this.description = description
        this.icon = icon
        this.isNew = isNew
    }
}

// Create a generic Map object.
export function Map() {
    const [sidebarOpen, setSideBarOpen] = useState(true);
    const handleViewSidebar = () => setSideBarOpen(!sidebarOpen)
    const [markers, setMarkers] = useState([])
    const [activeIcon, setActiveIcon] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(isMobile ? 1 : 3);
    const mapRef = useRef();

    useEffect(() => {
        const loadCreationChanges = (rawData) => {
            const data = rawData.onCreateAltheaMapTokenData
            const marker = new MapMarker(data.id, JSON.parse(data.position), data.description, data.icon)
            if (markers.map((m) => m.id).includes(marker.id)) return
            loadMarkersData()
        }

        const createSub = createMarkerSubscription(loadCreationChanges);
        const updateSub = updateMarkerSubscription(loadMarkersData);
        const deleteSub = deleteMarkerSubscription(loadMarkersData);
        return () => {
            createSub.unsubscribe();
            updateSub.unsubscribe();
            deleteSub.unsubscribe();
        }
    }, [markers]);

    // Function which creates location markers to be rendered on the map.
    const LocationMarkers = () => {
        return (
            <DrawableMarkers
                markers={markers}
                removeMarker={removeMarker}
                updateMarker={updateMarker}
                zoomLevel={zoomLevel}
            />
        )
    }

    const removeMarker = (marker) => setMarkers(markers.filter((m) => m.id !== marker.id))
    const updateMarker = (marker) => {
        const idx = markers.findIndex(m => m.id === marker.id)
        markers[idx] = marker
        setMarkers(markers)
    }

    // Function to request data for each placed marker (icon, description, etc.).
    const loadMarkersData = async () => {
        fetchMarkers().then((markersData) => {
            const items = markersData.data.listAltheaMapTokenData.items
            setMarkers(items.map((entry) => new MapMarker(entry.id, JSON.parse(entry.position), entry.description, entry.icon)))
        })
    }

    // Load marker data when a Map object is added to the DOM.
    useEffect(() => { loadMarkersData() }, [])

    // Define a function that creates and returns  a new MapMarker object.
    const createMarker = (latLng) => {
        if (!activeIcon) return
        const m = new MapMarker(uuidv4(), latLng, "", activeIcon, true)
        setMarkers(markers.concat([m]))
    }

    // On mouse double-clicks, create a marker at the clicked location on the map.
    const RegisterMapEvents = () => {
        const map = useMapEvents({
            zoomend: () => setZoomLevel(map.getZoom()),
            dblclick(e) { createMarker(e.latlng) },
            // zoom: () => updateBounds(),
            // move: () => updateBounds()
        })

        // Update CRS to prevent tiling
        Leaflet.CRS.EPSG3857.wrapLng = undefined;
        Leaflet.CRS.EPSG3857.wrapLat = undefined;
    }

     // Create an object which defined the bounds of a Leaflet map.
    //  const mapBounds = Leaflet.latLngBounds(
    //     Leaflet.latLng([0, -200]), // Southwest
    //     Leaflet.latLng(200, 400)     // Northeast
    // )

    // Create, populate, and return the map and it's related systems.
    return (
       <div 
            className='map'
        >
            <MapContainer
                ref={mapRef}
                center={[75, -85]} 
                zoom={zoomLevel}
                minZoom={isMobile ? 1 : 3}
                maxZoom={isMobile ? 5 : 6}
                doubleClickZoom={false}
                autoPanOnFocus={false}
                // maxBounds={mapBounds}
                maxBoundsViscosity={1}
                bubblingMouseEvents={false}
            >
                <RegisterMapEvents/>
                <TileLayer 
                    className='tile-layer'
                    url={'../mapTiles/{z}/{x}/{y}.png'}
                />
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
