
import './App.css'

import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookDetailsPage from './pages/BookDetailsPage';
import NavigationPage from './pages/NavigationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import NotFoundPage from './pages/NotFoundPage'; 
import DashboardPage from './pages/DashboardPage';
import BottomNav from './components/BottomNav';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/book/:bookId" element={<BookDetailsPage />} />
      <Route path="/navigation/:bookId" element={<NavigationPage />} />
      <Route path="/reservations" element={<MyReservationsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <BottomNav />
    </>
  );
}

export default App;
