import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Home from './components/Home'
import Deadends from './components/Deadends/index'
import Anagrams from './components/Anagrams'
function App() {
    return (
        <Router>
            
                <Switch>
                   
                    <Route path="/" exact component={Deadends} />
                    <Route path="/deadend" exact component={Deadends} />
                    <Route path="/anagrams" exact component={Anagrams} />
                </Switch>
            
        </Router>
    );
}

export default App;
