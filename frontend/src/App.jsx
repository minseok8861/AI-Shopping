import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";

function Home() {
    return (
        <div>
            <h1>AI Shopping</h1>
            <Link to="/signup">
                <button>회원가입</button>
            </Link>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;