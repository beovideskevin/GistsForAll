
import axios from "axios";

const getGists = async (lastOne, removed) => {
    try {
        let allItems = [];
        let lastItem = null;
        let featuredItems = [];

        // Get all the gists
        let response = await axios.get('gists?per_page=128');
        response.data.forEach((record) => {
            // It takes some time for Github to update deleted records
            if (removed.includes(record.id)) {
                return;
            }
            Object.keys(record.files).forEach((filename) => {
                const item = {
                    id: record.id,
                    filename: gistName(filename), 
                    description: record.description,
                    abstract: "",
                    url: record.html_url,
                    starred: false,
                    updated: record.updated_at
                }
                allItems.push(item);
            });
        });

        // Order sidebar links by name
        allItems.sort((a, b) => a.filename.localeCompare(b.filename));

        // Get starred items
        response = await axios.get(`gists/starred`);
        response.data.forEach((record) => {
            // Set the nav link to starred in the sidebar
            allItems.filter((item) => item.id === record.id).forEach((starred) => {starred.starred = true});
        });

        // Order the gists by updated date
        const orderByLatest = [...allItems];
        orderByLatest.sort((a, b) => (
            new Date(a.updated).getTime() < new Date(b.updated).getTime() ? 1 : -1
        ));

        // Get the last worked on gist
        let idOfLast = null;
        if (lastOne) {
            idOfLast = lastOne.id;
        }
        else {
            // If there is no lastItem get the last item by updated
            idOfLast = orderByLatest.shift()?.id || null;
        }
        // Built the item info
        if (idOfLast) {
            response = await axios.get(`gists/${idOfLast}`);
            const files = Object.values(response.data.files);
            let abstract = "";
            files[0].content.split("\n").forEach((line) => {
                if (abstract.length < 400) {
                    abstract += line + "\n";
                }
            });
            lastItem = {
                id: idOfLast,
                filename: files[0].filename,
                description: response.data.description,
                abstract: abstract,
                url: response.data.html_url,
                starred: false,
                updated: response.data.updated_at,
            };
        }

        orderByLatest.slice(0, 11).forEach(record => {
            if (record.id === idOfLast) {
                return;
            }
            const item = {
                id: record.id,
                filename: record.filename,
                description: record.description,
                abstract: "",
                url: record.html_url,
                starred: true,
                updated: record.updated_at,
            }
            featuredItems.push(item);
        });

        // Always leave the last spot empty
        if (featuredItems.length === 12) {
            featuredItems.pop();
        }

        // Fill the array with empty items because otherwise the design breaks a little
        while(featuredItems.length < 12) {
            featuredItems.push({
                id: "",
                filename: "",
                description: "",
                abstract: "",
                url: "",
                starred: false,
                updated: "",
            });
        }

        return {
            lastGist: lastItem,
            featuredGists: featuredItems, 
            allGists: allItems,
        }
    }
    catch(error) {
        console.log(error);
        return { error };
    }
}

const gistName = (filename) => {
    return filename.indexOf('.') !== -1 ?
        filename.slice(0, filename.lastIndexOf('.')) :
        filename;
}

const getGist = async (id) => {
    try {
        const gist = await axios.get(`gists/${id}`);
        return gist;
    } catch(error) {
        console.log(error)
        return false
    }
}

const saveGist = async (id, payload) => {
    try {
        let result = null;
        if (id) {
            result = await axios.patch(`gists/${id}`, payload);
        }
        else {
            result = await axios.post("gists", payload);
        }
        return result;
    } catch(error) {
        console.log(error);
        return false;
    }
}

const gistStart = async (id, start) => {
    try {
        if (start) {
            await axios.put(`gists/${props.item.id}/star`);
        }
        else {
            await axios.delete(`gists/${props.item.id}/star`);
        }
    } catch(error) {
        console.log(error);
        return false;
    }
    return true;
}

const delGist = async (id) => {
    try {
        await axios.delete(`gists/${id}`);
    }
    catch(error) {
        console.log(error);
        return false;
    }
    return true;
}

export {
    getGists,
    gistName,
    getGist,
    saveGist,
    gistStart,
    delGist,
};