import React from 'react';

const FieldType = ({ onAddField }) => {
  const fieldTypes = [
    { type: 'text', label: 'Text Field', icon: '📝' },
    { type: 'number', label: 'Number Field', icon: '🔢' },
    { type: 'email', label: 'Email Field', icon: '✉️' },
    { type: 'password', label: 'Password Field', icon: '🔒' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'select', label: 'Dropdown', icon: '🔽' },
    { type: 'checkbox', label: 'Checkbox Group', icon: '☑️' },
    { type: 'radio', label: 'Radio Group', icon: '⚪' },
    { type: 'date', label: 'Date Picker', icon: '📅' },
    { type: 'file', label: 'File Upload', icon: '📎' },
  ];

  return (
    <div className="space-y-2">
      {fieldTypes.map((field) => (
        <button
          key={field.type}
          className="w-full flex items-center p-3 bg-blue-50 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => onAddField(field.type)}
        >
          <span className="mr-2">{field.icon}</span>
          <span>{field.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FieldType;