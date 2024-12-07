import { IconSelector } from "./IconSelector";

export function SideBar({isOpen, toggleSidebar, setActiveIcon}) {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";
    return (
        <div>
            
            <button onClick={toggleSidebar} className = "sidebar-toggle">
                {isOpen ? "<<" : ">>"}
            </button>
            <div className={sidebarClass}>
                <IconSelector handleSelectedIcon={(icon) => setActiveIcon(icon)}/>
            </div>
        </div>
    );
};
