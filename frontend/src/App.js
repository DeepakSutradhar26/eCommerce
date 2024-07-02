import './App.css';
import Header from "./Components/layout/Header/Header.js";
import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import WebFont from "webfontloader";
import Footer from "./Components/layout/Footer/Footer.js";
import Home from './Components/Home/Home.js';

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roborto", "Droid Sans", "Chilanka"]
      }
    })
  }, []);

  return (
    <Router>
      <Header />
      <Home/>
      <Footer/>
    </Router>
  );
}

export default App;
