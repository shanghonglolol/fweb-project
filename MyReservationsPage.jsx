import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import reservationService from '../services/reservationService';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import './css/MyReservationsPage.css';

const MyReservationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [reservations, setReservations] = useState({ active: [], history: [] });
  const [loading, setLoading] = useState(true);

  // load reservations from API on mount
  useEffect(() => {
    loadReservations();
  }, []);

  // fetch reservations from backend
  const loadReservations = async () => {
    setLoading(true);
    const data = await reservationService.getAllReservations();
    setReservations(data);
    setLoading(false);
  };

  // handle confirm pickup
  const handleConfirmPickup = async (id) => {
    await reservationService.confirmPickup(id);
    loadReservations(); // refresh list
  };

  // handle cancel reservation
  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      await reservationService.cancelReservation(id);
      loadReservations(); // refresh list
    }
  };

  // get status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ready': return 'status-ready';
      case 'waiting': return 'status-queue';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>My reservations</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'active' ? 'tab-active' : ''}`} onClick={() => setActiveTab('active')}>
          Active
        </button>
        <button className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`} onClick={() => setActiveTab('history')}>
          History
        </button>
      </div>

      {/* Active Tab */}
      {activeTab === 'active' && (
        <div className="reservations-content">
          {reservations.active.length === 0 ? (
            <EmptyState icon="📚" title="No active reservations" message="You don't have any active reservations" />
          ) : (
            <div className="reservations-list">
              {reservations.active.map((r) => (
                <div key={r._id} className="reservation-card">
                  <div className="reservation-card-header">
                    <div>
                      <h3 className="book-title-reservation">{r.title}</h3>
                      <p className="book-author-reservation">{r.author}</p>
                    </div>
                    <span className={`status-badge-reservation ${getStatusBadgeClass(r.status)}`}>
                      {r.statusText}
                    </span>
                  </div>
                  <div className="reservation-details">
                    <div className="detail-row"><span>📅</span><span>Reserved: {r.reservedDate}</span></div>
                    {r.status === 'ready' && (
                      <>
                        <div className="detail-row"><span>⏰</span><span>Pick up by: {r.expiresDate}</span></div>
                        <div className="detail-row"><span>📍</span><span>Location: {r.location}</span></div>
                      </>
                    )}
                    {r.status === 'waiting' && (
                      <>
                        <div className="detail-row"><span>👥</span><span>Queue position: #{r.queuePosition}</span></div>
                        <div className="detail-row"><span>📊</span><span>{r.estimatedAvailability}</span></div>
                      </>
                    )}
                  </div>
                  <div className="reservation-actions">
                    {r.status === 'ready' && (
                      <Button onClick={() => handleConfirmPickup(r._id)} variant="secondary" fullWidth>
                        Confirm Pickup
                      </Button>
                    )}
                    <Button onClick={() => handleCancel(r._id)} variant="danger" fullWidth>
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="reservations-content">
          {reservations.history.length === 0 ? (
            <EmptyState icon="📜" title="No history" message="You don't have any past reservations" />
          ) : (
            <div className="reservations-list">
              {reservations.history.map((r) => (
                <div key={r._id} className="reservation-card">
                  <div className="reservation-card-header">
                    <div>
                      <h3 className="book-title-reservation">{r.title}</h3>
                      <p className="book-author-reservation">{r.author}</p>
                    </div>
                    <span className={`status-badge-reservation ${getStatusBadgeClass(r.status)}`}>
                      {r.statusText}
                    </span>
                  </div>
                  <div className="reservation-details">
                    <div className="detail-row"><span>📅</span><span>Reserved: {r.reservedDate}</span></div>
                    {r.status === 'completed' && (
                      <div className="detail-row"><span>✅</span><span>Picked up: {r.pickedUpDate}</span></div>
                    )}
                    {r.status === 'cancelled' && (
                      <div className="detail-row"><span>❌</span><span>Cancelled: {r.cancelledDate}</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;