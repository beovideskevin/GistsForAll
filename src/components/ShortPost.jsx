import React, { useContext, useEffect, useState } from "react";
import AppContext from "../utils/context.jsx"
import { gistName } from '../utils/gists.jsx';

const ShortPost = ({ id, filename, description, pos }) => {
    const [name, setName] = useState();
    const context = useContext(AppContext);

    useEffect(() => {
        setName(gistName(filename));
    }, [filename]);

    if (!id) {
        return (
            <article></article>
        );
    }

    return (
        <article className={`shortPost-${pos}`}>
            <h3><span onClick={() => { context.navigate("show", id) }}>{name}</span></h3>
            <p>{description}</p>
            <ul className="actions">
                <li><span onClick={() => { context.navigate("show", id) }} className="button small">Read</span></li>
            </ul>
        </article>
    );
}

export default ShortPost;