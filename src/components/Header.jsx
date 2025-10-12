import React, { useContext, useEffect, useState } from "react";
import AppContext from "../utils/context.jsx"
import { gistName, delGist} from '../utils/gists.jsx';

const Header = ({filename, url, id, navigate}) => {
    const [name, setName] = useState();
    const context = useContext(AppContext);
    
    useEffect(() => {
        setName(gistName(filename));
    }, [filename]);

    const delGistAndNavigate = async (id) => {
        if (window.confirm("Are you sure you want to delete this gist?")) {
            const result = await delGist(id);
            if (!result) {
                context.popup("Error deleting gist. Please check your internet connection or the URL.", "error");
                return;
            }
            context.popup("Gist deleted successfully.");
            context.navigate(`delete`, id);
        }
    }

    return (
        <header id="header">
            { id !== "" ?
                <span className="logo" onClick={() => {context.navigate("show", id)}}><strong>{name}</strong></span> :
                <div className="logo"><strong>{name}</strong></div> }
            { id !== "" ?
                <ul className="icons" id="shortcuts">
                    <li><span onClick={() => {context.navigate("edit", id)}} className="icon solid fa-edit">&nbsp;</span></li>
                    <li><span onClick={() => {delGistAndNavigate(id)}} className="icon solid fa-trash">&nbsp;</span></li>
                    <li><span onClick={() => {context.navigate("list", null)}} className="icon solid fa-home">&nbsp;</span></li>
                </ul> :
                <ul className="icons">
                    <li><span onClick={() => {context.navigate("list", null)}} className="icon solid fa-home">&nbsp;</span></li>
                </ul> }
        </header>
    );
};

export default Header;