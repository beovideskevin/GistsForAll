import React, { useContext, useEffect, useState } from "react";
import AppContext from "../utils/context.jsx"

const Search = ({ filteredItems }) => {
    const [search, setSearch] = useState("");
    const [navItems, setNavItems] = useState([]);
    const context = useContext(AppContext);

    useEffect(() => {
        setNavItems(context.allItems);
    }, [context.allItems]);

    useEffect(() => {
        const results = navItems.filter(
            (item) => item.filename.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
        );
        filteredItems(results);
    }, [search, navItems]);

    return (
        <section id="search" className="alt">
            <form method="" onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search Gists..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                    }}
                />
            </form>
        </section>
    );
};

export default Search;