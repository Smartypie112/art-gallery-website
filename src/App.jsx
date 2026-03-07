import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ThankYou from "./Components/ThankYou";
import BookingPage from "./pages/BookingPage";
import SelectionPage from "./pages/SelectionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/selection" element={
        <SelectionPage /> }/>
    </Routes>
  );
}

export default App;