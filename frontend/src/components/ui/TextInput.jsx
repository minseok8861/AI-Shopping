import './TextInput.css';

const variantClasses = {
  white: 'ui-text-input-white',
  black: 'ui-text-input-black',
  example: 'ui-text-input-example',
};

export function TextInput({ variant = 'white', type = 'text', className = '', ...props }) {
  return (
    <input {...props} type={type} className={`ui-text-input ${variantClasses[variant] ?? ''} ${className}`} />
  );
}
