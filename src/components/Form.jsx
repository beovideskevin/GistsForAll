import React, { useEffect, useRef, useState } from "react";
import {
    BlockTypeSelect, 
    BoldItalicUnderlineToggles,
    codeBlockPlugin, 
    codeMirrorPlugin, 
    CodeToggle, 
    CreateLink,
    diffSourcePlugin, 
    DiffSourceToggleWrapper,
    headingsPlugin,
    imagePlugin, 
    InsertCodeBlock, 
    InsertTable, 
    InsertThematicBreak, 
    linkDialogPlugin, 
    linkPlugin,
    listsPlugin, 
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor, 
    MDXEditorMethods,
    quotePlugin, 
    Separator, 
    tablePlugin, 
    thematicBreakPlugin, 
    toolbarPlugin, 
    UndoRedo
} from "@mdxeditor/editor";
import axios from "axios";
import Header from "./Header.jsx";
import '@mdxeditor/editor/style.css';
import { getGist, saveGist } from '../utils/gists.jsx';

const codeBlockLanguages = [
    '',
    'bash',
    'c',
    'css',
    'html',
    'java',
    'javascript',
    'jsx',
    'json',
    'php',
    'python',
    'graphql',
    'scss',
    'sql',
    'typescript',
    'tsx',
    'txt',
    'xml',
    'yaml'
];

const Form = ({ id, navigate, popup }) => {
    const ref = useRef(null);
    const [fileKey, setFileKey] = useState("");
    const [filename, setFilename] = useState("Untitled");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [initialContent, setInitialContent] = useState("");
    const [initialFilename, setInitialFilename] = useState("Untitled");
    const [initialDescription, setInitialDescription] = useState("");
    const [initialVisibility, setInitialVisibility] = useState("private");

    useEffect(() => {
        return () => {
            setFileKey("");
            setFilename("Untitled");
            setUrl("");
            setDescription("");
            setVisibility("private");
            setInitialContent("");
            setInitialFilename("Untitled");
            setInitialDescription("");
            setInitialVisibility("private");
        }
    }, []);

    useEffect(() => {
        (async function () {
            window.scrollTo(0, 0);
            if (!id) {
                setFileKey("");
                setFilename("Untitled");
                setUrl("");
                setDescription("");
                setVisibility("private");
                setInitialContent("");
                setInitialFilename("Untitled");
                setInitialDescription("");
                setInitialVisibility("private");
                return;
            }
            const gist = await getGist(id);
            if (!gist || Object.values(gist.data.files).length === 0) {
                popup("Error fetching data. Please check your internet connection or the URL.", "error");
                navigate("list", null);
                return;
            }
            setUrl(gist.data.html_url);
            setDescription(gist.data.description);
            setInitialDescription(gist.data.description);
            setVisibility(gist.data.public ? "public" : "private");
            setInitialVisibility(gist.data.public ? "public" : "private");
            const fileKey = Object.keys(gist.data.files)[0];
            setFileKey(fileKey);
            const files = Object.values(gist.data.files)[0];
            setFilename(files.filename);
            setInitialFilename(files.filename);
            const content = files.content
                .trim()
                .replace(/```\w+/g, (str) => str.toLowerCase()) // Fixes the problem with capital letters in code blocks
                .replace(/\n\n\n+/g, '\n\n') // Remove extra new lines, "fixes horror vacui" bug
            setInitialContent(content);
            ref.current?.setMarkdown(content);
        })();
    }, [id]);

    const save = async (fileWithExt, content) => {
        const files = {
            [fileWithExt]: {
                "filename": fileWithExt,
                "content": content,
                "type": "text/markdown",
                "language": "Markdown"
            }
        };
        if (fileKey !== fileWithExt) {
            files[fileKey] = null;
            setFileKey(fileWithExt);
        }
        const editPayload = {
            description: description,
            public: visibility === "public",
            files
        };
        const response = await saveGist(id, editPayload);
        if (!response) {
            popup("Error saving data. Please check your internet connection or the URL.", "error");
            return;
        }
        setInitialFilename(fileWithExt);
        setInitialDescription(description);
        setInitialVisibility(visibility);
        setInitialContent(content || "");
        popup("Gist saved successfully.");
    }

    const create = async (fileWithExt, content) => {
        const createPayload = {
            description: description,
            public: visibility === "public",
            files: {
                [fileWithExt]: {
                    "filename ": fileWithExt,
                    "content": `${content}`,
                    "type": "text/markdown",
                    "language": "Markdown"}
            }
        };
        const response = await saveGist(id, createPayload);
        if (!response) {
            popup("Error saving data. Please check your internet connection or the URL.", "error");
            return;
        }
        popup("Gist created successfully.");
        navigate("show", response.data.id)
    }

    const submit = (e) => {
        if (e) {
            e.preventDefault();
        }
        if (filename.length === 0 || description.length === 0) {
            popup("Please enter a filename and description before saving.");
            return;
        }
        let fileWithExt = filename.endsWith(".md") ? filename : filename + ".md";
        setFilename(fileWithExt);
        const content = ref.current?.getMarkdown()
            .trim()
            .replace(/\n\n\n+/g, '\n\n') // Remove extra new lines, "fixes horror vacui" bug
            .replace(/&#.*;/g, ''); // Remove HTML entities for utf8 chars; another bug
        
        // save the gist
        if (id) {
            save(fileWithExt, content);
        }
        // create a new gist
        else {
            create(fileWithExt, content);
        }
    }

    const cancel = () => {
        if (window.confirm("Are you sure? You will lose the changes.")) {
            if (id) {
                navigate(`show`, id);
            }
            else {
                navigate(`list`, null);
            }
        }
    }

    const resetGist = () => {
        if (window.confirm("Are you sure? This will reset the gist to its original state.")) {
            setFilename(initialFilename);
            setDescription(initialDescription);
            setVisibility(initialVisibility);
            ref.current?.setMarkdown(initialContent)
        }
    }

    return (
        <div className="inner">
            <Header filename={filename} url={url} id={id}/>
            <section>
                <form onSubmit={submit} id="gistForm">
                    <div className="row gtr-uniform">
                        <div className="col-6 col-12-small">
                            <input type="text" name="filename" id="filename" placeholder="File Name"
                                   onChange={(e) => {setFilename(e.target.value)}} value={filename}/>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="private" name="visibility" checked={visibility === "private"}
                                   value="private" onChange={(e) => {setVisibility(e.target.value)}}/>
                            <label htmlFor="private">Private</label>
                        </div>

                        <div className="col-3 col-12-small">
                            <input type="radio" id="public" name="visibility" checked={visibility === "public"}
                                   value="public" onChange={(e) => {setVisibility(e.target.value)}}/>
                            <label htmlFor="public">Public</label>
                        </div>

                        <div className="col-12 col-12-small">
                            <input type="text" name="description" id="description" placeholder="Description"
                                   onChange={(e) => {setDescription(e.target.value)}} value={description}/>
                        </div>

                        <div className="col-12">
                            <MDXEditor
                                onError={(error) => {console.log(error)}}
                                className="editorForm"
                                ref={ref}
                                markdown=""
                                plugins={[
                                    imagePlugin(),
                                    markdownShortcutPlugin(),
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    diffSourcePlugin(),
                                    linkPlugin(),
                                    linkDialogPlugin(),
                                    tablePlugin(),
                                    codeBlockPlugin({defaultCodeBlockLanguage: 'javascript'}),
                                    codeMirrorPlugin({
                                        codeBlockLanguages: codeBlockLanguages.reduce((acc, language) => {
                                            acc[language] = language;
                                            return acc;
                                        }, {}),
                                    }),
                                    toolbarPlugin({
                                        toolbarContents: () => (
                                            <>
                                                <DiffSourceToggleWrapper>
                                                    <UndoRedo/>
                                                    <BlockTypeSelect/>
                                                    <BoldItalicUnderlineToggles/>
                                                    <Separator/>
                                                    <ListsToggle/>
                                                    <Separator/>
                                                    <CreateLink/>
                                                    <InsertTable/>
                                                    <InsertThematicBreak/>
                                                    <Separator/>
                                                    <InsertCodeBlock/>
                                                    <CodeToggle/>
                                                </DiffSourceToggleWrapper>
                                            </>
                                        )
                                    })
                                ]}
                            />
                        </div>
                        <div className="col-12 fixedBtns">
                            <ul className="actions actionsCenter">
                                <li><input type="submit" value="Save" className="button primary small" id="saveForm" /></li>
                                <li><input type="reset" value="Cancel" className="button small"
                                           onClick={cancel}/></li>
                                <li><input type="reset" value="Reset" className="button small"
                                           onClick={resetGist}/></li>
                            </ul>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Form;