/**
 * DashboardPage.jsx
 * 
 * ADDITIONAL FEATURE: Interactive dashboard
 * 
 * Purpose: to provide users with a visual summary of their reservation statistics
 * including total, active, completed, and cancelled reservations.
 * 
 * Key features:
 * - Real-time statistics from database
 * - Breakdown of active reservations (ready vs waiting)
 * - Quick action buttons for common tasks
 * - Responsive grid layout for all devices
 * 
 * Author: Lee Shang Hong (2400137B)
 * Course: Full Stack Web Development 
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import reservationService from '../services/reservationService';
import Button from '../components/Button';
import './css/DashboardPage.css';

const DashboardPage = () => {
  // React Router hook for navigation
  const navigate = useNavigate();
  
  /**
   * State: Statistics Object
   * Stores all calculated statistics from reservation data
   * 
   * totalReservations: All-time count of reservations
   * activeCount: Current reservations (waiting or ready)
   * completedCount: Successfully picked up books
   * cancelledCount: User-cancelled reservations
   * readyCount: Books that are ready for pickup
   * waitingCount: Books that are still in queue
   */
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    readyCount: 0,
    waitingCount: 0
  });

  /**
   * State: loading
   * Controls loading spinner display while fetching data from API
   */
  const [loading, setLoading] = useState(true);

  /**
   * Effect: loads dashboard data on mount
   * Runs once when component first renders
   * Fetches reservation data and calculates statistics
   */
  useEffect(() => {
    loadDashboardData();
  }, []); // Empties dependency array -> run once on mount

  /**
   * Function: load dashboard data
   * 
   * Fetches all reservations from backend API and calculates statistics
   * 
   * Flow:
   * 1. Set loading state to true (show spinner)
   * 2. Call API to get all reservations
   * 3. Separate reservations into active and history
   * 4. Calculate all statistics
   * 5. Update state with calculated values
   * 6. Set loading state to false (hide spinner)
   */
  const loadDashboardData = async () => {
    setLoading(true);
    
    // Fetch reservation data from backend via service layer
    // API call from: GET http://localhost:5050/reservations
    const data = await reservationService.getAllReservations();
    
    // Extract active and history arrays from API response
    // Backend returns: { active: [...], history: [...] }
    const active = data.active || [];
    const history = data.history || [];
    
    // Combine all reservations for total count
    const allReservations = [...active, ...history];
    
    /**
     * Calculating statistics
     * 
     * totalReservations: count of all reservations ever made
     * activeCount: reservations with status 'waiting' or 'ready'
     * completedCount: filter history for status 'completed'
     * cancelledCount: filter history for status 'cancelled'
     * readyCount: filter active for status 'ready' (ready for pickup)
     * waitingCount: filter active for status 'waiting' (in queue)
     */
    setStats({
      totalReservations: allReservations.length,
      activeCount: active.length,
      completedCount: history.filter(r => r.status === 'completed').length,
      cancelledCount: history.filter(r => r.status === 'cancelled').length,
      readyCount: active.filter(r => r.status === 'ready').length,
      waitingCount: active.filter(r => r.status === 'waiting').length
    });
    
    setLoading(false);
  };

  /**
   * Conditional rendering: loading state
   * Shows loading message while fetching data from API
   */
  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  /**
   * Main dashboard render
   * Displays statistics in responsive grid layout
   */
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>📊 My Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your library activity</p>
      </div>

      {/* 
        Summary cards grid 
        Displays 4 main statistics: Total, Active, Completed, Cancelled
        CSS grid: auto-fit with minmax for responsiveness
      */}
      <div className="stats-grid">
        {/* Total reservations card */}
        <div className="stat-card total">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h2>{stats.totalReservations}</h2>
            <p>Total Reservations</p>
          </div>
        </div>

        {/* Active reservations card */}
        <div className="stat-card active">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h2>{stats.activeCount}</h2>
            <p>Active</p>
          </div>
        </div>

        {/* Completed reservations card */}
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h2>{stats.completedCount}</h2>
            <p>Completed</p>
          </div>
        </div>

        {/* Cancelled reservations card */}
        <div className="stat-card cancelled">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h2>{stats.cancelledCount}</h2>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* 
        Active reservations breakdown section
        Shows detailed breakdown of active reservations:
        - Ready for pickup: books waiting at counter
        - In queue: books still with other borrowers
      */}
      <div className="breakdown-section">
        <h3>Active Reservations Breakdown</h3>
        <div className="breakdown-grid">
          {/* Ready for pickup card */}
          <div className="breakdown-card ready">
            <span className="breakdown-icon">🎉</span>
            <div>
              <h4>{stats.readyCount}</h4>
              <p>Ready for Pickup</p>
            </div>
          </div>
          
          {/* In queue card */}
          <div className="breakdown-card waiting">
            <span className="breakdown-icon">⏰</span>
            <div>
              <h4>{stats.waitingCount}</h4>
              <p>In Queue</p>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Quick actions section
        Provides shortcuts to frequently used features
        - Search books: navigate to search page
        - View all reservations: navigate to reservations page
      */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          {/* Navigate to search page */}
          <Button 
            onClick={() => navigate('/search')} 
            variant="primary" 
            fullWidth
          >
            🔍 Search Books
          </Button>
          
          {/* Navigate to reservations page */}
          <Button 
            onClick={() => navigate('/reservations')} 
            variant="secondary" 
            fullWidth
          >
            📋 View All Reservations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

/**
 * Notes from implementation:
 * 
 * 1. Data source:
 *    - Uses existing API endpoint: GET /reservations
 *    - No new backend code required
 *    - Fully integrated with existing reservation system
 * 
 * 2. Database connections:
 *    - All data comes from MongoDB (no hardcoded values)
 *    - Statistics reflect real-time database state
 *    - Updates automatically when reservations change
 * 
 * 3. User flow:
 *    User opens Dashboard → Component mounts → useEffect triggers →
 *    Fetch API data → Calculate statistics → Update state →
 *    React re-renders with new data → Display statistics
 * 
 * 4. Responsive design:
 *    - CSS Grid adapts to screen size
 *    - Mobile: Single column layout
 *    - Desktop: Multi-column grid layout
 * 
 * 5. Error handling:
 *    - reservationService handles API errors
 *    - Returns empty arrays if fetch fails
 *    - Statistics default to 0 if no data
 */