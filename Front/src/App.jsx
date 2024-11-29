import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homegrow from "./Homegrow";
import CalendarImage from "./CalenderImage";
import ControlMode from './ControlMode';

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 text-gray-800 dark:text-gray-200">
                <nav className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="container mx-auto px-6 py-3">
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/calendar" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Calendar</Link>
                            </li>
                            <li>
                                <Link to="/control" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">Control Panel</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Homegrow />} />
                        <Route path="/calendar" element={<CalendarImage />} />
                        <Route path="/control" element={<ControlMode />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}