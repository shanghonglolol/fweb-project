import './css/Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  type = 'button',
  disabled = false 
}) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''}`}>
      {children}
    </button>
  );
};

export default Button;