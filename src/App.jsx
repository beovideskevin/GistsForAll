import React, { useEffect, useState } from 'react';
import AppContext from "./utils/context.jsx"
import FauxRouter from './components/FauxRouter.jsx';
import List from './pages/List.jsx';
import Show from './pages/Show.jsx';
import Edit from './pages/Edit.jsx';
import Create from './pages/Create.jsx';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';
import axios from "axios";
import { marked } from "marked";
import { getHeadingList, gfmHeadingId } from "marked-gfm-heading-id";
import { getGists } from './utils/gists.jsx';
import { Toaster, toast } from 'sonner';

marked.use(gfmHeadingId({prefix: "",}), {
    hooks: {
        postprocess(html) {
            const headings = getHeadingList();
            let output = "<div id='table-of-contents'><h2>Table of contents</h2>";
            let level = 0;
            headings.forEach((item) => {
                if (item.level > level) {
                    output += `<ol id="table-of-contents-ol">`;
                } else if (level === item.level) {
                    output += `</li>`;
                } else if (item.level < level) {
                    output += `</li></ol></li>`;
                }
                output += `<li><a href="${window.location.protocol+'//'+window.location.host+window.location.pathname}#${item.id}" class="index-header${item.level}">${item.raw}</a>`;
                level = item.level;
            });
            for (; level > 0; level--) {
                output += `</li></ol>`;
            }
            output += `</div>`;
            return `${output}${html}`
        }
    }
});

function App() {
    const [allItems, setAllItems] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);
    const [lastItem, setLastItem] = useState(null);
    const [removed, setRemoved] = useState([]);
    const [githubToken, setGithubToken] = useState(null);
    const [showToken, setShowToken] = useState(false); 
    const [showFind, setShowFind] = useState(false); 
    const [id, setId] = useState(null);
    const [view, setView] = useState("list");

    // Set up the main event listeners
    useEffect(() => {
        window.electronAPI.on("message", (message) => {
            popup(message);
        });

        window.electronAPI.on("error", (message) => {
            popup(message, "error");
        });

        window.electronAPI.on("token", (message) => {
            setShowToken(true);
        });

        window.electronAPI.on("create", (message) => {
            setView("create");
        });

        window.electronAPI.on("save", (message) => {
            const button = document.getElementById("saveForm");
            if (button) {
                button.click();
            }
        });

        window.electronAPI.on("find", (message) => {
            setShowFind(true);
        });
    }, []);

    useEffect(() => {
        (async function () {
            if (!githubToken) {
                // Get token from localStorage
                const token = localStorage.getItem('githubToken');
                if (!token) {
                    setShowToken(true);
                    return;
                }
                setGithubToken(token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            const {
                lastGist,
                featuredGists, 
                allGists, 
                error
            } = await getGists(lastItem, removed);

            if (error) {
                popup("Error fetching gists. Please check your internet connection or the URL.", "error");
                return;
            }

            setLastItem(lastGist);
            setFeaturedItems(featuredGists);
            setAllItems(allGists);
        })();
    }, [githubToken, view]);

    const navigate = (view, id) => {
        if (view === "delete") {
            setRemoved([...removed, id]);
            if (id == lastItem.id) {
                setLastItem(null);
            }
            setId(null);
            setView("list");
            return;
        }
        setView(view);
        setId(id);
    }

    const popup = (message, type) => {
        console.log(message);
        if (!type) {
            toast.success(message);
        }
        else {
            window.electronAPI.showAlert({
                type: type, // Can be 'error', but also 'info', 'warning', 'question'
                title: 'Alert Title',
                message: message,
                buttons: ['OK']
            });
        }
    }

    return (
        <div id="wrapper" className="App">
            <Toaster position="top-right" toastOptions={{
                style: {
                  background: 'green',
                  color: 'white'
                },
            }} />

            <AppContext value={{ view, id, navigate, popup, lastItem, featuredItems, allItems, removed }}>
                <FauxRouter>
                    <List view="list" />
                    <Show view="show" />
                    <Create view="create" />
                    <Edit view="edit" />
                </FauxRouter>

                <Sidebar />
            </AppContext>

            { showToken && <Modal placeholder="Enter Github access token: ghp_..." btnValue="Set Token" callBackFn={(token) => {
                if (token) {
                    setGithubToken(token)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    localStorage.setItem('githubToken', token);
                }
                setShowToken(false);
            }} /> }

            { showFind && <Modal placeholder="Enter text to search..." btnValue="Search" callBackFn={(searchText) => {
                if (searchText) {
                    window.electronAPI.send('search-text', searchText);
                }
                setShowFind(false);
            }} /> }
        </div>
    );
}

export default App;
