const FormInput = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1.5 mb-4">
      {label && (
        <label className="text-sm font-medium text-gray-700 ml-0.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`input ${error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : ''}`}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium ml-0.5">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
