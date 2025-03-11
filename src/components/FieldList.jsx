import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import FieldEditor from './FieldEditor';

const FieldList = ({ fields, onRemoveField, onUpdateField }) => {
  const [editingField, setEditingField] = useState(null);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleCloseEditor = () => {
    setEditingField(null);
  };

  const handleFieldUpdate = (updatedField) => {
    onUpdateField(updatedField);
    setEditingField(null);
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Draggable key={field.id} draggableId={field.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div {...provided.dragHandleProps} className="mr-3 cursor-move">
                    ⠿
                  </div>
                  <div>
                    <h4 className="font-medium">{field.label}</h4>
                    <p className="text-sm text-gray-500">Type: {field.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditField(field)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemoveField(field.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}

      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Edit Field</h3>
            <FieldEditor 
              field={editingField} 
              onUpdate={handleFieldUpdate} 
              onCancel={handleCloseEditor} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldList;