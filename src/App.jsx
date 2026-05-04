import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from '@routes/routes';
import Loading from '@ui/Loading';
import ScrollToTop from './components/common/ScrollToTop';
import './App.css';

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map((route, index) => {
            if (route.routes) {
              return (
                <Route element={route.element} key={index} path={route.path}>
                  {route.routes.map((subRoute, subIndex) => (
                    <Route
                      key={subIndex}
                      path={subRoute.path}
                      element={subRoute.element}
                      exact={subRoute.exact}
                    />
                  ))}
                </Route>
              );
            } else {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                  exact={route.exact}
                />
              );
            }
          })}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
