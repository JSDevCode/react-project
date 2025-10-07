import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne } from "../../api/data";

import "./Update.css";

function Update({ socket }) {
  const { id } = useParams(); // Hämtar id från URL.
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Hämtar initialt dokument
  useEffect(() => {
    getOne(id)
      .then((result) => {
        setTitle(result.doc.title);
        setContent(result.doc.content);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Sockets
  useEffect(() => {
    if (!id || !socket.current) return;

    // Joina rum.
    socket.current.emit("create", id);

    // Skapar en eventlyssnare för "doc"
    socket.current.on("doc", (data) => {
      setTitle(data.title);
      setContent(data.content);
    });

    return () => {
      // Tar bort listener när en komponent 'unmounts'.
      socket.current.off("doc");
    };
  }, [id]);

  const redirectToDocs = async () => {
    navigate("/"); // Tillbaka till listan
  };

  return (
    <div className="update-container">
      <h2>Update document {id}</h2>
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          socket.current.emit("doc", {
            _id: id,
            title: e.target.value,
            content,
          });
        }}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          socket.current.emit("doc", {
            _id: id,
            title,
            content: e.target.value,
          });
        }}
        placeholder="Content"
      />
      <button className="update-btn" onClick={redirectToDocs}>
        Docs
      </button>
    </div>
  );
}

export default Update;
