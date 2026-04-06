import './css/BookCard.css';

const BookCard = ({ book, onClick }) => {
  return (
    <div className="book-card" onClick={() => onClick(book.id)}>
      <div className="book-card-header">
        <div>
          <h3 className="book-card-title">{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
        </div>
        <span className={`status-badge ${book.status === 'available' ? 'status-available' : 'status-borrowed'}`}>
          {book.status === 'available' ? '● Available' : '● Borrowed'}
        </span>
      </div>

      <div className="book-card-info">
        {book.status === 'available' ? (
          <span className="book-card-location">
            📍 Level {book.location.level}, Section {book.location.section}
          </span>
        ) : (
          <span className="book-card-due">
            📅 Due date is on: {book.dueDate}
          </span>
        )}
      </div>
    </div>
  );
};

export default BookCard;