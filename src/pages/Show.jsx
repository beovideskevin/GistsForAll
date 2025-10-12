import React, { useContext, useEffect, useState } from 'react';
import AppContext from "../utils/context.jsx"
import Header from "../components/Header.jsx";
import { marked } from 'marked';
import { getGist, delGist } from '../utils/gists.jsx';

const Show = () => {
    const [id, setId] = useState();
    const [files, setFiles] = useState({});
    const [url, setUrl] = useState("");
    
    const context = useContext(AppContext);

    useEffect(() => {
        setId(context.id);
    }, [context.id]);

    useEffect(() => {
        (async function () {
            window.scrollTo(0, 0);

            if (!id) {
                return;
            }

            const gist = await getGist(id);
            if (!gist || Object.values(gist.data.files).length === 0) {
                context.popup("Gist has no files. Please check your internet connection or the URL.", "error");
                context.navigate("list", null);
                return;
            }
            
            setUrl(gist.data.html_url);
            setFiles(gist.data.files);
        })();
    }, [id]);

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
        <div id="main" className="noOverflowX">
            {
                Object.entries(files).map(([filename, data]) => (
                    <div className="inner" key={filename}>
                        <Header filename={filename} url={url} id={id} />
                        <section>
                            <div dangerouslySetInnerHTML={{__html: marked.parse(data.content)}}/>
                            <ul className="actions actionsCenter">
                                <li><span onClick={() => { context.navigate("edit", id) }} className="button primary small">Edit</span></li>
                                <li><span onClick={() => { delGistAndNavigate(id) }} className="button small">Delete</span></li>
                            </ul>
                        </section>
                    </div>
                ))
            }
        </div>
    );
}

export default Show;