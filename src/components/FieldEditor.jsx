import React, { useState } from 'react';

const FieldEditor = ({ field, onUpdate, onCancel }) => {
  const [fieldData, setFieldData] = useState({ ...field });
  const [newOption, setNewOption] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldData({
      ...fieldData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setFieldData({
        ...fieldData,
        options: [...fieldData.options, newOption.trim()],
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...fieldData.options];
    newOptions.splice(index, 1);
    setFieldData({
      ...fieldData,
      options: newOptions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(fieldData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Label
          <input
            type="text"
            name="label"
            value={fieldData.label}
            onChange={handleChange}
            className="form-control mt-1"
            required
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Placeholder
          <input
            type="text"
            name="placeholder"
            value={fieldData.placeholder || ''}
            onChange={handleChange}
            className="form-control mt-1"
          />
        </label>
      </div>

      {['select', 'radio', 'checkbox'].includes(fieldData.type) && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <div className="space-y-2 mt-1">
            {fieldData.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...fieldData.options];
                    newOptions[index] = e.target.value;
                    setFieldData({
                      ...fieldData,
                      options: newOptions,
                    });
                  }}
                  className="form-control"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="form-control"
                placeholder="Add new option"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="required"
            checked={fieldData.required || false}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Required Field
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default FieldEditor;