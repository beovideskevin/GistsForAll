import React, { useState, useEffect } from 'react';
import Search from "./Search.jsx";
import About from './About.jsx';
import Nav from "./Nav.jsx";
import New from "./New.jsx";
import Copy from "./Copy.jsx";

const Sidebar = () => {
    const [filtered, setFiltered] = useState([]);
    const [sidebar, setSidebar] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div id="sidebar" className={sidebar || width >= 1280 ? "" : "hidden"}>
            <div className="toggle" onClick={e => toggleSidebar()}>Toggle</div>
            <div className="inner">
                <Search filteredItems={setFiltered} />
                <Nav filteredItems={filtered}/>
                <New />
                <About />
                <Copy />
            </div>
        </div>
    );
}

export default Sidebar;