import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from '@routes/routes';
import Loading from '@ui/Loading';
import ScrollToTop from './components/common/ScrollToTop';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from './lib/analytics';
import './App.css';


function App() {
  const location = useLocation();

  React.useEffect(() => {
    initGA();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

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
