import Button from './Button';
import './css/EmptyState.css';

const EmptyState = ({
    icon = '📚',
    title,
    message,
    buttonText,
    onButtonClick
}) => {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h3 className="empty-title">{title}</h3>
            <p className="empty-message">{message}</p>
            {buttonText && onButtonClick && (
                <Button onClick={onButtonClick} variant="primary">
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;