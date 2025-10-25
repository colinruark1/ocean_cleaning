/**
 * Reusable page header component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.description] - Page description
 * @param {React.ReactNode} [props.action] - Action button or element
 */
const PageHeader = ({ title, description, action, children }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
