import React, { useContext, useState, useEffect } from 'react';
import AppContext from "../utils/context.jsx"
import NotFound from '../pages/NotFound.jsx';

const FauxRouter = ({children}) => {
    const [page, setPage] = useState("list");
    const context = useContext(AppContext);

    useEffect(() => {
        const pageToFind = context.view || "list";
        let foundPage = children.find(child => child.props.view === pageToFind);      
        foundPage ||= <NotFound page="404" />;
        setPage(foundPage);
    }, [context.view]);
    
    return (
        <>
        { page } 
        </>
    );
};

export default FauxRouter;