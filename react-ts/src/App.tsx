// import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import routes from './router';

function App() {
  return (
    <div className="App">
      <HashRouter>
        {routes.map(({ path, component, ...routes }) => (
          <Route key={path} path={path} component={component} {...routes} />
        ))}
      </HashRouter>
    </div>
  );
}

export default App;
