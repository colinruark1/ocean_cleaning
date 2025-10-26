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
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`rounded-lg shadow-md ${hoverStyles} ${clickableStyles} ${className}`}
      style={{backgroundColor: '#FFFFFF'}}
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
  <div className={`px-6 py-4 border-b ${className}`} style={{borderColor: '#E5E7EB'}} {...props}>
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
  <div className={`px-6 py-4 border-t ${className}`} style={{borderColor: '#E5E7EB'}} {...props}>
    {children}
  </div>
);

export default Card;
