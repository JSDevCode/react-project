import { useState, useEffect } from "react";
import { getAllData } from "../api/data";
import "./Docs.css";

function Docs() {
  useEffect(() => {
    getAllData()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return <p>Se consolen för data</p>;
}

export default Docs;
