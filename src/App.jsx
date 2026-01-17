import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./dashboard/Dashboard";
import Home from "./pages/Home";
import Login from "./Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRoute } from "./routes/AppRoute";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <ThemeProvider>
      <ScrollToTop />
          <>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                {AppRoute.map((l,i)=>{
                  const Com = l.component;
                  return <Route key={i} path={l.path} element={<Com />} />
                })}
              </Route>
            </Routes>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
          </>
    </ThemeProvider>
  );
};

export default App;
