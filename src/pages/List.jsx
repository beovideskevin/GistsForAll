import React, { useContext, useState, useEffect } from 'react';
import AppContext from "../utils/context.jsx"
import Header from "../components/Header.jsx";
import ShortPost from "../components/ShortPost.jsx";
import Why from "../components/Why.jsx";
import { marked } from "marked";

const List = () => {
    const [latest, setLatest] = useState();
    const [shortPosts, setShortPosts] = useState([]);
    const context = useContext(AppContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!context.lastItem) {
            return;
        }
        setLatest(context.lastItem);
        if (!context.featuredItems.length) {
            return;
        }
        setShortPosts(context.featuredItems);
    }, [context.lastItem, context.featuredItems]);

    if (!latest) {
        return (
            <div id="main" className="noOverflowX">
                <div className="inner">
                    <Header filename="" url="" id="" />
                    <section>
                        <h2>Gists</h2>
                        <p>No gists found.</p>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div id="main" className="noOverflowX">
            <div className="inner">
                <Header filename={latest.filename} url={latest.url} id={latest.id} />

                { latest && <section className="abstract">
                    <div dangerouslySetInnerHTML={{__html: marked.parse(latest.abstract)}}/>
                    <ul className="actions">
                        <li><span onClick={() => { context.navigate("show", latest.id) }} className="button small">Read</span></li>
                    </ul>
                </section> }

                <Why/>

                <section>
                    <header className="major">
                        <h2>Starred gists</h2>
                    </header>
                    <div className="posts">
                        {shortPosts.map((item, index) => {
                                return (<ShortPost id={item.id} filename={item.filename} key={index.toString()}
                                               description={item.description} pos={index} />)
                            }
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default List;