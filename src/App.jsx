import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from '@routes/routes';
// import { routes } from './routes/routes.jsx';
import Loading from '@ui/Loading';
import './App.css';

function App() {
  return (
    <>
      <div className="App">
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                exact={route.exact}
              />
            ))}
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
