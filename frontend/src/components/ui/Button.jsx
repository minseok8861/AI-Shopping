import './Button.css';

const variantClasses = {
  white: 'ui-button-white',
  black: 'ui-button-black',
  account: 'ui-button-account',
  delete: 'ui-button-delete',
};

export function Button({ variant = 'white', type = 'button', className = '', children, ...props }) {
  return (
    <button {...props} type={type} className={`ui-button ${variantClasses[variant] ?? ''} ${className}`}>
      {children}
    </button>
  );
}
