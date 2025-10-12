import React, { useContext, useEffect, useState } from "react";
import AppContext from "../utils/context.jsx"
import { gistStart } from '../utils/gists.jsx';

const GistLink = (props) => {
    const [starred, setStarred] = useState(false);
    const context = useContext(AppContext);

    useEffect(() => {
        setStarred(props.item.starred);
    }, [props.item.starred]);

    const removeStar = async () => {
        const result = await gistStart(props.item.id, false);
        if (!result) {
            context.popup("Error removing star. Please check your internet connection or the URL.", "error");
            return;
        }
        setStarred(false);
    }

    const addStar = async () => {
        const result = await gistStart(props.item.id, true); 
        if (!result) {
            context.popup("Error starring gist. Please check your internet connection or the URL.", "error");
            return;
        }
        setStarred(true);
    }

    const openWin = (e, url) => {
        e.preventDefault();
        window.electronAPI.send('open-win', url);
    }

    return (
        <li>{starred ? <span className="icon solid fa-star navListIcon" onClick={() => { removeStar() }}>&nbsp;</span> :
            <span className="icon fa-star navListIcon" onClick={() => { addStar() }}>&nbsp;</span>}
            <span onClick={e => openWin(e, props.item.url)} className="icon solid fa-link navListIcon">&nbsp;</span>
            <span className="navList"
            onClick={() => {context.navigate('show', props.item.id)}}>{props.item.filename}</span></li>
    );
};
export default GistLink;
