import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function Contenido() {
    const location = useLocation();

    return (
        <>
            {location.pathname !== "/login" && <Navbar />}
            <AppRoutes />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Contenido />
        </BrowserRouter>
    );
}

export default App;