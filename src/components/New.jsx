import React, { useContext } from 'react';
import AppContext from "../utils/context.jsx"

const New = () => {
    const context = useContext(AppContext);

    return (
        <section>
            <header className="major">
                <h2>Add content</h2>
            </header>
            <p>If you can't find what you are looking for, maybe you should create a new gist.</p>
            <ul className="actions">
                <li id="createNewBtn"><span onClick={() => {context.navigate("create", null)}} className="button primary">New</span></li>
            </ul>
        </section>
    );
}

export default New;