import { IconSelector } from "./IconSelector";

export function SideBar({isOpen, toggleSidebar, setActiveIcon}) {
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";
    return (
        <div className={sidebarClass}>
            <IconSelector handleSelectedIcon={(icon) => setActiveIcon(icon)}/>
            <button onClick={toggleSidebar} className = {isOpen ? "sidebar-toggle open" : "sidebar-toggle"}>
                {isOpen ? "<<" : ">>"}
            </button>
        </div>
    );
};
