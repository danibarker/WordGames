import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Deadends from "./components/Deadends/index";
import Anagrams from "./components/Anagrams";
function App() {
    return <Deadends />;
}

export default App;
