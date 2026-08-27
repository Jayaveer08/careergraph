import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";
import CompaniesPage from "./pages/CompaniesPage";
import GraphPage from "./pages/GraphPage";
export default function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/jobs", element: _jsx(JobsPage, {}) }), _jsx(Route, { path: "/companies", element: _jsx(CompaniesPage, {}) }), _jsx(Route, { path: "/graph", element: _jsx(GraphPage, {}) })] })] }));
}
