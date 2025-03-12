import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addResponse } from "../store/formBuilderSlice";
import * as Yup from "yup";

const FormPreview = ({ form }) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const dispatch = useDispatch();

  // Validate form prop
  if (!form || !Array.isArray(form.fields)) {
    console.error("Invalid form data:", form);
    return <p className="text-red-500">Form data is missing or invalid.</p>;
  }

  // Build validation schema dynamically
  const buildValidationSchema = () => {
    if (!form.fields || form.fields.length === 0) {
      return Yup.object().shape({});
    }

    const schemaFields = {};

    form.fields.forEach((field) => {
      let fieldSchema;

      switch (field.type) {
        case "text":
          fieldSchema = Yup.string().max(20, "Text cannot exceed 20 characters");
          break;
        case "password":
          fieldSchema = Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be at most 20 characters")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(
              /[!@#$%^&*(),.?":{}|<>]/,
              "Password must contain at least one special character"
            );
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
        if (field.type === "checkbox") {
          fieldSchema = fieldSchema.min(1, "At least one option must be selected");
        } else {
          fieldSchema = fieldSchema.required("This field is required");
        }
      }

      schemaFields[field.id] = fieldSchema;
    });

    return Yup.object().shape(schemaFields);
  };

  const validationSchema = useMemo(() => buildValidationSchema(), [form]);

  const handleChange = async (e, fieldId, fieldType) => {
    const { name, value, type, checked } = e.target;

    let updatedValues = { ...formValues };

    if (fieldType === "checkbox") {
      updatedValues[fieldId] = updatedValues[fieldId] || [];
      if (checked) {
        updatedValues[fieldId] = [...updatedValues[fieldId], value];
      } else {
        updatedValues[fieldId] = updatedValues[fieldId].filter(
          (item) => item !== value
        );
      }
    } else if (type === "checkbox") {
      updatedValues[name] = checked;
    } else {
      updatedValues[name] = value;
    }

    setFormValues(updatedValues);

    // Real-time validation for the changed field
    try {
      await validationSchema.validateAt(fieldId, updatedValues, { abortEarly: false });
      setErrors((prev) => ({ ...prev, [fieldId]: [] }));
    } catch (validationError) {
      const fieldErrors = validationError.errors;
      setErrors((prev) => ({ ...prev, [fieldId]: fieldErrors }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fields || form.fields.length === 0) {
      console.error("Form fields are missing or empty.");
      return;
    }

    try {
      await validationSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      setIsSubmitted(true);
      dispatch(addResponse({ formId: form.id, response: formValues }));
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        if (!newErrors[error.path]) {
          newErrors[error.path] = [];
        }
        newErrors[error.path].push(error.message);
      });
      setErrors(newErrors);
      setIsSubmitted(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
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
            className="form-control w-full p-2 border rounded"
          />
        );
      case "password":
        return (
          <div className="relative">
            <input
              type={showPasswords[field.id] ? "text" : "password"}
              id={field.id}
              name={field.id}
              value={formValues[field.id] || ""}
              onChange={(e) => handleChange(e, field.id)}
              placeholder={field.placeholder}
              className="form-control w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  [field.id]: !prev[field.id],
                }))
              }
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            >
              {showPasswords[field.id] ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
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
            className="form-control w-full p-2 border rounded"
          />
        );
      case "select":
        return (
          <select
            id={field.id}
            name={field.id}
            value={formValues[field.id] || ""}
            onChange={(e) => handleChange(e, field.id)}
            className="form-control w-full p-2 border rounded"
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
                  className="mr-2"
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
                  className="mr-2"
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
    <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto border-2 border-solid border-red-300">
      <h2 className="text-xl font-bold mb-6">{form.name} - Preview</h2>

      {isSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Success!</p>
          <p>Form submitted successfully.</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                {errors[field.id] && errors[field.id].length > 0 && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors[field.id].map((msg, idx) => (
                      <p key={idx}>{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No fields added yet.</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Form
          </button>
        </form>
      )}
    </div>
  );
};

export default FormPreview;