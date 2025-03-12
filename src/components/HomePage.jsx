// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { createNewForm, loadForm, deleteForm } from '../store/formBuilderSlice';

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { forms } = useSelector((state) => state.formBuilder);

//   const handleCreateNewForm = () => {
//     dispatch(createNewForm('New Form'));
//     navigate('/builder');
//   };

//   const handleLoadForm = (formId) => {
//     dispatch(loadForm(formId));
//     navigate('/builder');
//   };

//   const handleDeleteForm = (formId) => {
//     if (window.confirm('Are you sure you want to delete this form?')) {
//       dispatch(deleteForm(formId));
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center my-6">Custom Dynamic Form Builder</h1>
//       <button
//         className="btn btn-primary mb-4"
//         onClick={handleCreateNewForm}
//       >
//         Create New Form
//       </button>
//       <h2 className="text-2xl font-semibold mb-2">Previous Forms</h2>
//       {forms.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {forms.map((form) => (
//             <div
//               key={form.id}
//               className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
//             >
//               <h3 className="text-lg font-medium mb-2">{form.name}</h3>
//               <div className="flex justify-between">
//                 <button
//                   className="text-blue-500 hover:underline"
//                   onClick={() => handleLoadForm(form.id)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="text-red-500 hover:text-red-700"
//                   onClick={() => handleDeleteForm(form.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No forms created yet.</p>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewForm, loadForm, deleteForm } from '../store/formBuilderSlice';
import { motion } from 'framer-motion'; // Adding subtle animations

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms } = useSelector((state) => state.formBuilder);

  const handleCreateNewForm = () => {
    dispatch(createNewForm('New Form'));
    navigate('/builder');
  };

  const handleLoadForm = (formId) => {
    dispatch(loadForm(formId));
    navigate('/builder');
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteForm(formId));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Custom Dynamic Form Builder
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNewForm}
          className="block mx-auto mb-12 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          Create New Form
        </motion.button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">
          Previous Forms
        </h2>

        {forms.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {forms.map((form) => (
              <motion.div
                key={form.id}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <h3 className="text-xl font-medium text-gray-800 mb-4 truncate">{form.name}</h3>
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => handleLoadForm(form.id)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ x: -4 }}
                    onClick={() => handleDeleteForm(form.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg bg-white/80 py-4 px-6 rounded-lg shadow-md"
          >
            No forms created yet. Start by creating your first form!
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default HomePage;