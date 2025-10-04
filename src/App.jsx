import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from '@routes/routes';
import Loading from '@ui/Loading';
import { ThemeProvider } from '@provider/ThemeProvider/ThemeProvider';
import './App.css';
import Navbar from '@components/Navbar/Navbar';
import Footer from '@components/Footer/Footer';

function App() {
  const location = useLocation();

  // Define routes where you want to hide navbar and footer
  const hideLayoutRoutes = ['/login', '/register', '/auth', '/community'];
  const shouldHideLayout = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <ThemeProvider>
      <div className="App">
        {!shouldHideLayout && <Navbar />}
        <main className={shouldHideLayout ? '' : 'min-h-screen'}>
          <Suspense fallback={<Loading />}>
            <Routes>
              {routes.map((route, index) => {
                if (route.routes) {
                  return (
                    <Route
                      element={<route.element />}
                      key={index}
                      path={route.path}
                    >
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
        </main>
        {!shouldHideLayout && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
