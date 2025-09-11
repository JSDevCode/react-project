import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Docs from "./pages/Docs/Docs.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Docs />} />
          </Routes>
        </main>
      </Router>
      <Footer />
    </>
  );
}

export default App;
