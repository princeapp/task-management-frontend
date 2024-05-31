import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Category name is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (editingCategory) {
        try {
          await api.put(`/categories/${editingCategory.id}`, values);
          setEditingCategory(null);
          fetchCategories();
          toast.success('Category updated successfully!');
        } catch (err) {
          setError('Failed to update category');
          toast.error('Failed to update category');
        }
      } else {
        try {
          await api.post('/categories', values);
          fetchCategories();
          resetForm();
          toast.success('Category added successfully!');
        } catch (err) {
          setError('Failed to add category');
          toast.error('Failed to add category');
        }
      }
    },
  });

  const startEditing = (category) => {
    setEditingCategory(category);
    formik.setValues({ name: category.name });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    formik.resetForm();
  };

  const handleDelete = async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      fetchCategories();
      toast.success('Category deleted successfully!');
    } catch (err) {
      setError('Failed to delete category');
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={formik.handleSubmit}>
        <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>
        <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
        {editingCategory && <button type="button" onClick={cancelEditing}>Cancel</button>}
      </form>

      <div className="category-list">
        <h3>Category List</h3>
        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => startEditing(category)}>Edit</button>
                  <button onClick={() => handleDelete(category.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
