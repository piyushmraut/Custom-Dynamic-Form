// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { DragDropContext, Droppable } from '@hello-pangea/dnd';
// import { useNavigate } from 'react-router-dom';
// import {
//   addField,
//   removeField,
//   updateField,
//   reorderFields,
//   saveForm,
//   updateFormName,
//   loadForm
// } from '../store/formBuilderSlice';
// import FieldList from './FieldList';
// import FieldType from './FieldType';
// import FormPreview from './FormPreview';

// const FormBuilder = () => {
//   // State for active tab and shareable link
//   const [activeTab, setActiveTab] = useState('builder');
//   const [shareableLink, setShareableLink] = useState('');

//   // Redux hooks
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentForm } = useSelector((state) => state.formBuilder);

//   // Add a new field to the form
//   const handleAddField = (type) => {
//     const fieldConfig = {
//       type,
//       label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
//       placeholder: '',
//       required: false,
//       options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : [],
//     };
//     dispatch(addField(fieldConfig));
//   };

//   // Remove a field from the form
//   const handleRemoveField = (id) => {
//     dispatch(removeField(id));
//   };

//   // Update an existing field
//   const handleUpdateField = (updatedField) => {
//     dispatch(updateField(updatedField));
//   };

//   // Handle drag-and-drop reordering of fields
//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     dispatch(reorderFields({
//       sourceIndex: result.source.index,
//       destinationIndex: result.destination.index
//     }));
//   };

//   // Save the form and generate a shareable link
//   const handleSaveForm = () => {
//     dispatch(saveForm());
//     const link = `${window.location.origin}/form/${currentForm.id}`;
//     setShareableLink(link);
//     // alert("Form Saved Successfully")
//     alert(`Form saved successfully! Shareable link: ${link}`);
//   };

//   // Update the form name
//   const handleFormNameChange = (e) => {
//     dispatch(updateFormName(e.target.value));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between mb-6">
//           <div className="w-1/2 pr-2">
//             <input
//               type="text"
//               value={currentForm.name}
//               onChange={handleFormNameChange}
//               className="form-control text-xl font-semibold"
//               placeholder="Form Name"
//             />
//           </div>
//           <div className="w-1/2 flex justify-end space-x-2">
//             <button
//               className="btn btn-primary"
//               onClick={handleSaveForm}
//             >
//               Save Form
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={() => navigate('/')}
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>

//         {/* Tabs Navigation */}
//         <div className="border-b border-gray-200 mb-6">
//           <nav className="flex -mb-px">
//             <button
//               className={`py-4 px-6 border-b-2 font-medium text-sm ${
//                 activeTab === 'builder'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//               onClick={() => setActiveTab('builder')}
//             >
//               Form Builder
//             </button>
//             <button
//               className={`py-4 px-6 border-b-2 font-medium text-sm ${
//                 activeTab === 'preview'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//               onClick={() => setActiveTab('preview')}
//             >
//               Preview Form
//             </button>
//             {/* <button
//               className={`py-4 px-6 border-b-2 font-medium text-sm ${
//                 activeTab === 'responses'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//               onClick={() => setActiveTab('responses')}
//             >
//               Responses
//             </button> */}
//           </nav>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'builder' ? (
//           <div className="grid grid-cols-4 gap-6">
//             <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-medium mb-4">Field Types</h3>
//               <FieldType onAddField={handleAddField} />
//             </div>
//             <div className="col-span-3">
//               <h3 className="text-lg font-medium mb-4">Form Structure</h3>
//               <DragDropContext onDragEnd={handleDragEnd}>
//                 <Droppable droppableId="form-fields">
//                   {(provided) => (
//                     <div
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       className="bg-gray-50 p-4 rounded-lg min-h-[400px]"
//                     >
//                       <FieldList
//                         fields={currentForm.fields}
//                         onRemoveField={handleRemoveField}
//                         onUpdateField={handleUpdateField}
//                       />
//                       {provided.placeholder}
//                       {currentForm.fields.length === 0 && (
//                         <div className="text-center py-10 text-gray-500">
//                           Drag and drop fields here to build your form
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </Droppable>
//               </DragDropContext>
//               {shareableLink && (
//                 // mt-4 p-4 bg-blue-100 rounded
//                 <div className="mt-4 p-4 bg-blue-100 rounded">
//                   <p>
//                     Shareable Link:{' '}
//                     <a href={shareableLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
//                       {shareableLink}
//                     </a>
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : activeTab === 'preview' ? (
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <FormPreview form={currentForm} />
//             </div>
//             {/* <div className="bg-gray-50 p-6 rounded-lg">
//               <h2 className="text-xl font-bold mb-6">{currentForm.name} - Responses</h2>
//               {currentForm.responses && currentForm.responses.length > 0 ? (
//                 <div className="space-y-4">
//                   {currentForm.responses.map((response, index) => (
//                     <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                       <h3 className="font-medium mb-2">Response {index + 1}</h3>
//                       <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-8 text-center text-gray-500">
//                   No responses yet.
//                 </div>
//               )}
//             </div> */}
//           </div>
//         ) : (
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">{currentForm.name} - Responses</h2>
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => dispatch(loadForm(currentForm.id))}
//               >
//                 Refresh
//               </button>
//             </div>
//             {currentForm.responses && currentForm.responses.length > 0 ? (
//               <div className="space-y-4">
//                 {currentForm.responses.map((response, index) => (
//                   <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <h3 className="font-medium mb-2">Response {index + 1}</h3>
//                     <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="py-8 text-center text-gray-500">
//                 No responses yet.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FormBuilder;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import {
  addField,
  removeField,
  updateField,
  reorderFields,
  saveForm,
  updateFormName,
  loadForm
} from '../store/formBuilderSlice';
import FieldList from './FieldList';
import FieldType from './FieldType';
import FormPreview from './FormPreview';

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [shareableLink, setShareableLink] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state) => state.formBuilder);

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
    const link = `${window.location.origin}/form/${currentForm.id}`;
    setShareableLink(link);
    alert(`Form saved successfully! Shareable link: ${link}`);
  };

  const handleFormNameChange = (e) => {
    dispatch(updateFormName(e.target.value));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
            <input
              type="text"
              value={currentForm.name}
              onChange={handleFormNameChange}
              className="form-control text-xl font-semibold w-full"
              placeholder="Form Name"
            />
          </div>
          <div className="w-full sm:w-1/2 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={handleSaveForm}
            >
              Save Form
            </button>
            <button
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex flex-wrap -mb-px">
            <button
              className={`py-4 px-4 sm:px-6 border-b-2 font-medium text-sm ${
                activeTab === 'builder'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('builder')}
            >
              Form Builder
            </button>
            <button
              className={`py-4 px-4 sm:px-6 border-b-2 font-medium text-sm ${
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

        {/* Tab Content */}
        {activeTab === 'builder' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Field Types</h3>
              <FieldType onAddField={handleAddField} />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-3">
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
              {shareableLink && (
                <div className="mt-4 p-4 bg-blue-100 rounded overflow-x-auto">
                  <p>
                    Shareable Link:{' '}
                    <a href={shareableLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                      {shareableLink}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'preview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormPreview form={currentForm} />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentForm.name} - Responses</h2>
              <button
                className="btn btn-secondary"
                onClick={() => dispatch(loadForm(currentForm.id))}
              >
                Refresh
              </button>
            </div>
            {currentForm.responses && currentForm.responses.length > 0 ? (
              <div className="space-y-4">
                {currentForm.responses.map((response, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-medium mb-2">Response {index + 1}</h3>
                    <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No responses yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;