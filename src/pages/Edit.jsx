import React, { useContext } from 'react';
import Form from "../components/Form.jsx";
import AppContext from "../utils/context.jsx"

const Edit = () => {    
    const context = useContext(AppContext);

    return (
        <div id="main">
            <Form id={context.id} navigate={context.navigate} popup={context.popup} />
        </div>
    );
}

export default Edit;