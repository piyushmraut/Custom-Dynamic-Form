import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fields: [],
  forms: [],
  currentForm: {
    id: 'default',
    name: 'New Form',
    fields: []
  }
};

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action) => {
      const newField = {
        id: Date.now().toString(),
        order: state.currentForm.fields.length,
        ...action.payload
      };
      state.currentForm.fields.push(newField);
    },
    removeField: (state, action) => {
      state.currentForm.fields = state.currentForm.fields.filter(
        field => field.id !== action.payload
      );
      // Update order after removal
      state.currentForm.fields = state.currentForm.fields.map((field, index) => ({
        ...field,
        order: index
      }));
    },
    updateField: (state, action) => {
      const { id, ...rest } = action.payload;
      const fieldIndex = state.currentForm.fields.findIndex(field => field.id === id);
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = {
          ...state.currentForm.fields[fieldIndex],
          ...rest
        };
      }
    },
    reorderFields: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.currentForm.fields.splice(sourceIndex, 1);
      state.currentForm.fields.splice(destinationIndex, 0, removed);
      
      // Update order after reordering
      state.currentForm.fields = state.currentForm.fields.map((field, index) => ({
        ...field,
        order: index
      }));
    },
    saveForm: (state) => {
      const formIndex = state.forms.findIndex(form => form.id === state.currentForm.id);
      if (formIndex !== -1) {
        state.forms[formIndex] = { ...state.currentForm };
      } else {
        state.forms.push({ ...state.currentForm });
      }
    },
    createNewForm: (state, action) => {
      state.currentForm = {
        id: Date.now().toString(),
        name: action.payload || 'New Form',
        fields: []
      };
    },
    loadForm: (state, action) => {
      const form = state.forms.find(form => form.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },
    updateFormName: (state, action) => {
      state.currentForm.name = action.payload;
    }
  }
});

export const {
  addField,
  removeField,
  updateField,
  reorderFields,
  saveForm,
  createNewForm,
  loadForm,
  updateFormName
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;