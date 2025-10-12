import React, { useState } from 'react';
import Search from "./Search.jsx";
import About from './About.jsx';
import Nav from "./Nav.jsx";
import New from "./New.jsx";
import Copy from "./Copy.jsx";

const Sidebar = () => {
    const [filtered, setFiltered] = useState([]);
    const [sidebar, setSidebar] = useState(true);

    const toggleSidebar = () => {
        setSidebar(!sidebar);
    }

    return (
        <div id="sidebar" className={sidebar ? "" : "hidden"}>
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