import React from 'react';
import GistLink from "./GistLink.jsx";

const Nav = (props) => {
    return (
        <nav id="menu">
            <header className="major">
                <h2>Gists</h2>
            </header>
            <ul>
                { props.filteredItems.map(item => (
                    <GistLink item={item} key={item.id}/>
                ))}
            </ul>
        </nav>
    );
}

export default Nav;