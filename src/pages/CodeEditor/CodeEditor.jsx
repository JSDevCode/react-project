import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne, updateOne } from "../../api/data";
import Editor from '@monaco-editor/react';
import "./CodeEditor.css";

function CodeEditor() {
  const { id } = useParams(); // Hämtar id från URL.
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getOne(id)
      .then((result) => {
        setTitle(result.doc.title);
        setContent(result.doc.content);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleRun = (id) => {
    console.log("Run code");
    // navigate(`/update/${id}`);
  };

  const handleSave = async () => {
    await updateOne({ id, title, content });
    navigate("/"); // Tillbaka till listan
  };

  return (
    <>
        <Editor 
            height="70vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            defaultValue={content}
        />
        <button
            className="run-btn"
            onClick={() => handleRun(id)}
        >
            Run code
        </button>

        <button
            className="update-btn"
            onClick={() => handleSave(id)}
        >
            Save changes
        </button>
      </>
  );
}

export default CodeEditor;
