import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne, updateOne } from "../../api/data";
import Editor from '@monaco-editor/react';
import "./CodeEditor.css";
import { execJs } from "../../api/execjs";

function CodeEditor() {
    const { id } = useParams(); // Hämtar id från URL.
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOne(id)
        .then((result) => {
            setTitle(result.doc.title);
            setContent(result.doc.content);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [id]);

    const handleRun = async (id) => {
        const res = await execJs(content);
        setOutput(res);
    };

    const handleSave = async () => {
        await updateOne({ id, title, content });
        navigate("/"); // Tillbaka till listan
    };

    if (loading) {
        return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading editor...</p>
        </div>
        );
    }

    return (
        <>
            <h2>Code Editor for document {id}</h2>
            <button
                className="run-btn-code"
                onClick={() => handleRun(id)}
            >
                Run code
            </button>

            <button
                className="update-btn-code"
                onClick={() => handleSave(id)}
            >
                Save and exit
            </button>
            <Editor 
                height="60vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={content}
                onChange={(value) => setContent(value)}
            />
            <h3>Output:</h3>
            <pre className="output-box">{output}</pre>
        </>
    );
}

export default CodeEditor;
