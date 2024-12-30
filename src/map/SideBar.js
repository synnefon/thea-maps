import { IconSelector } from "./markers/IconSelector";

// Sidebar object that overlays on the map.
export function SideBar({isOpen, toggleSidebar, setActiveIcon}) {
    const sidebarClass = isOpen ? "map-sidebar open" : "map-sidebar";
    return (
        <div>
            
            <button onClick={toggleSidebar} className = "sidebar-toggle">
                {isOpen ? ">>" : "<<"}
            </button>
            <div className={sidebarClass}>
                <IconSelector handleSelectedIcon={(icon) => setActiveIcon(icon)}/>
            </div>
        </div>
    );
};
