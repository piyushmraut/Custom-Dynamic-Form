

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addResponse } from "../store/formBuilderSlice";
import * as Yup from "yup";

const FormPreview = ({ form }) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  // Ensure form and fields exist
  if (!form || !Array.isArray(form.fields)) {
    console.error("Invalid form data:", form);
    return <p className="text-red-500">Form data is missing or invalid.</p>;
  }

  // Build validation schema dynamically
  const buildValidationSchema = () => {
    if (!form.fields || form.fields.length === 0) {
      return Yup.object().shape({}); // Empty schema if no fields exist
    }

    const schemaFields = {};

    form.fields.forEach((field) => {
      let fieldSchema;

      switch (field.type) {
        case "text":
          fieldSchema = Yup.string();
          break;
        case "email":
          fieldSchema = Yup.string().email("Invalid email format");
          break;
        case "number":
          fieldSchema = Yup.number().typeError("Must be a number");
          break;
        case "date":
          fieldSchema = Yup.date().typeError("Invalid date");
          break;
        case "checkbox":
          fieldSchema = Yup.array();
          break;
        default:
          fieldSchema = Yup.string();
      }

      if (field.required) {
        fieldSchema = fieldSchema.required("This field is required");
      }

      schemaFields[field.id] = fieldSchema;
    });

    return Yup.object().shape(schemaFields);
  };

  const handleChange = (e, fieldId, fieldType) => {
    const { name, value, type, checked } = e.target;

    if (fieldType === "checkbox") {
      const updatedValues = { ...formValues };
      updatedValues[fieldId] = updatedValues[fieldId] || [];

      if (checked) {
        updatedValues[fieldId] = [...updatedValues[fieldId], value];
      } else {
        updatedValues[fieldId] = updatedValues[fieldId].filter(
          (item) => item !== value
        );
      }

      setFormValues(updatedValues);
    } else if (type === "checkbox") {
      setFormValues({
        ...formValues,
        [name]: checked,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fields || form.fields.length === 0) {
      console.error("Form fields are missing or empty.");
      return;
    }

    const validationSchema = buildValidationSchema();

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      setIsSubmitted(true);
      console.log("Form values:", formValues);
      dispatch(addResponse({ formId: form.id, response: formValues }));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitted(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(e, field.id)}
            placeholder={field.placeholder}
            className="form-control"
          />
        );
      case "textarea":
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(e, field.id)}
            placeholder={field.placeholder}
            rows="4"
            className="form-control"
          ></textarea>
        );
      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(e, field.id)}
            className="form-control"
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={(formValues[field.id] || "") === option}
                  onChange={(e) => handleChange(e, field.id)}
                  className="mr-2 h-4 w-4"
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={`${field.id}-${index}`}
                  value={option}
                  checked={(formValues[field.id] || []).includes(option)}
                  onChange={(e) => handleChange(e, field.id, "checkbox")}
                  className="mr-2 h-4 w-4"
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "file":
        return (
          <input
            type="file"
            id={field.id}
            name={field.id}
            onChange={(e) => handleChange(e, field.id)}
            className="form-control"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">{form.name} - Preview</h2>

      {isSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Success!</p>
          <p>Form submitted successfully. </p>
          <button
            className="mt-2 btn btn-primary"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.length > 0 ? (
            form.fields.map((field) => (
              <div key={field.id} className="space-y-1">
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No fields added yet.</p>
          )}

          <button type="submit" className="btn btn-primary">
            Submit Form
          </button>
        </form>
      )}
    </div>
  );
};

export default FormPreview;
