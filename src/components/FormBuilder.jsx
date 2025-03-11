import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  addField,
  removeField,
  updateField,
  reorderFields,
  saveForm,
  createNewForm,
  loadForm,
  updateFormName
} from '../store/formBuilderSlice';
import FieldList from './FieldList';
import FieldType from './FieldType';
import FormPreview from './FormPreview';

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const dispatch = useDispatch();
  const { currentForm, forms } = useSelector((state) => state.formBuilder);

  const handleAddField = (type) => {
    const fieldConfig = {
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : [],
    };
    dispatch(addField(fieldConfig));
  };

  const handleRemoveField = (id) => {
    dispatch(removeField(id));
  };

  const handleUpdateField = (updatedField) => {
    dispatch(updateField(updatedField));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    dispatch(reorderFields({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index
    }));
  };

  const handleSaveForm = () => {
    dispatch(saveForm());
    alert('Form saved successfully!');
  };

  const handleCreateNewForm = () => {
    dispatch(createNewForm());
  };

  const handleLoadForm = (formId) => {
    dispatch(loadForm(formId));
  };

  const handleFormNameChange = (e) => {
    dispatch(updateFormName(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <div className="w-1/2 pr-2">
          <input
            type="text"
            value={currentForm.name}
            onChange={handleFormNameChange}
            className="form-control text-xl font-semibold"
            placeholder="Form Name"
          />
        </div>
        <div className="w-1/2 flex justify-end space-x-2">
          <button
            className="btn btn-secondary"
            onClick={handleCreateNewForm}
          >
            New Form
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSaveForm}
          >
            Save Form
          </button>
          <select
            className="form-control"
            onChange={(e) => handleLoadForm(e.target.value)}
            value=""
          >
            <option value="" disabled>
              Load Saved Form
            </option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'builder'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('builder')}
          >
            Form Builder
          </button>
          <button
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview Form
          </button>
        </nav>
      </div>

      {activeTab === 'builder' ? (
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Field Types</h3>
            <FieldType onAddField={handleAddField} />
          </div>
          <div className="col-span-3">
            <h3 className="text-lg font-medium mb-4">Form Structure</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-50 p-4 rounded-lg min-h-[400px]"
                  >
                    <FieldList
                      fields={currentForm.fields}
                      onRemoveField={handleRemoveField}
                      onUpdateField={handleUpdateField}
                    />
                    {provided.placeholder}
                    {currentForm.fields.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                        Drag and drop fields here to build your form
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      ) : (
        <FormPreview form={currentForm} />
      )}
    </div>
  );
};

export default FormBuilder;