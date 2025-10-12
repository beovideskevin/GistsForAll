import React, { useContext } from 'react';
import Form from "../components/Form.jsx";
import AppContext from "../utils/context.jsx"

const Create = () => {
    const context = useContext(AppContext);

    return (
        <div id="main">
            <Form navigate={context.navigate} popup={context.popup} />
        </div>
    );
}

export default Create;