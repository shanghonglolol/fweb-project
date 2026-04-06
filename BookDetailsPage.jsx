import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import bookService from '../services/bookService';
import reservationService from '../services/reservationService';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './css/BookDetailsPage.css';

const BookDetailsPage = () => {
    const { bookId } = useParams(); //get bookId from url
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //simulates loading
        const fetchBook = async () => {
            setLoading(true);
            setError(null);

            try {
                //finding book by id
                const foundBook = await bookService.getBookById(bookId);
                setBook(foundBook);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    const handleBack = () => {
        navigate(-1); //goes back to previous page
    };

    const handleGetDirections = () => {
        navigate(`/navigation/${bookId}`);
    };

    const handleReserveBook = () => {
        try {
            reservationService.addReservation(book);
            alert(`Book "${book.title}" has been reserved!`);
            navigate('/reservations');
        } catch (err) {
            alert('Failed to reserve book. Please try again.');
        }
    };

    //loading state
    if (loading) {
        return <LoadingSpinner message="Loading book details..." />;
    }

    //error state
    if (error || !book) {
        return (
            <div className="book-details-container">
                <EmptyState
                    icon="❌"
                    title="Book not found"
                    message={error || 'The book you are looking for does not exist'}
                    buttonText="Go Back"
                    onButtonClick={handleBack}
                />
            </div>
        );
    }

    //main content
    return (
        <div className="book-details-container">
            <div className="book-details-header">
                <Button onClick={handleBack} variant="back">
                    ← Back
                </Button>
                <h1>Book Details</h1>
            </div>

            <div className="book-details-content">
                {/* Book Icon */}
                <div className="book-icon">📖</div>

                {/* Title and Author */}
                <h2 className="book-details-title">{book.title}</h2>
                <p className="book-details-author">{book.author}</p>

                {/* Status Badge */}
                <div className="status-section">
                    <span className={`status-badge-large ${book.status === 'available' ? 'status-available' : 'status-borrowed'}`}>
                        {book.status === 'available' ? '● Available now' : '● Currently Unavailable'}
                    </span>
                </div>

                {/* Book Information */}
                <div className="book-info-section">
                    <div className="info-title">Book info</div>
                    <div className="info-content">
                        <p><strong>Publisher:</strong> {book.publisher}</p>
                        <p><strong>Year:</strong> {book.year}</p>
                        <p><strong>Format:</strong> {book.format}</p>
                        <p><strong>Description:</strong></p>
                        <p>{book.description}</p>
                    </div>
                </div>

                {/* Location or Reservation Info */}
                {book.status === 'available' ? (
                    <div className="book-info-section">
                        <div className="info-title">Location</div>
                        <div className="location-details">
                            <span className="location-icon">📍</span>
                            <span className="location-text">
                                Level {book.location.level}, Section {book.location.section}, Shelf {book.location.shelf}
                            </span>
                        </div>
                        <p className="walk-time">⏱ {book.walkTime} minutes from entrance</p>
                    </div>
                ) : (
                    <div className="book-info-section">
                        <div className="info-title">Reservation Details</div>
                        <div className="reservation-info">
                            <div className="reservation-detail">
                                <span>📅</span>
                                <span><strong>Due back:</strong> {book.dueDate}</span>
                            </div>
                            <div className="reservation-detail">
                                <span>⏰</span>
                                <span><strong>Returns in:</strong> {book.returnDays} days</span>
                            </div>
                            <div className="reservation-detail">
                                <span>👥</span>
                                <span><strong>{book.waitingList} people already waiting</strong></span>
                            </div>
                            <div className="reservation-detail">
                                <span>📊</span>
                                <span><strong>Estimated availability:</strong> {book.estimatedAvailability}</span>
                            </div>
                            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                                You'll be #{book.waitingList + 1} in the reservation queue
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Button , diff ui based on book status*/}
                {book.status === 'available' ? (
                    <Button onClick={handleGetDirections} variant="primary" fullWidth>
                        Get directions
                    </Button>
                ) : (
                    <Button onClick={handleReserveBook} variant="secondary" fullWidth>
                        Reserve book
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;