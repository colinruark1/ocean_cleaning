/**
 * Card component for content containers
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hoverable=false] - Whether card should have hover effect
 * @param {Function} [props.onClick] - Click handler
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-all duration-200 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`rounded-lg shadow-md transition-colors duration-300 ${hoverStyles} ${clickableStyles} ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)'
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-b transition-colors duration-300 ${className}`}
    style={{borderColor: 'var(--color-border)'}}
    {...props}
  >
    {children}
  </div>
);

/**
 * Card Body component
 */
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-t transition-colors duration-300 ${className}`}
    style={{borderColor: 'var(--color-border)'}}
    {...props}
  >
    {children}
  </div>
);

export default Card;
