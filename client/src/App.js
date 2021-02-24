import "./styles/app.scss";
import SettingBar from "./сomponents/SettingBar";
import Toolbar from './сomponents/Toolbar';
import Canvas from './сomponents/Canvas';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingBar />
            <Canvas />
          </Route>
          <Redirect to={`f${(+new Date).toString(16)}`}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
