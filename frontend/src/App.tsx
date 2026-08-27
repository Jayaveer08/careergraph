import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";
import CompaniesPage from "./pages/CompaniesPage";
import GraphPage from "./pages/GraphPage";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/jobs"      element={<JobsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/graph"     element={<GraphPage />} />
      </Routes>
    </BrowserRouter>
  );
}
