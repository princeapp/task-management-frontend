import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import '../styles/Task.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/task');
      setTasks(response.data.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const taskSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category_id: Yup.string().required('Category is required'),
    priority: Yup.string().required('Priority is required'),
    due_date: Yup.string().required('Due date is required'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await api.post('/task', values);
      resetForm();
      fetchTasks();
      toast.success('Task added successfully!');
    } catch (err) {
      setError('Failed to add task');
      toast.error('Failed to add task');
    }
  };

  const handleEditSubmit = async (values, { resetForm }) => {
    try {
      await api.put(`/task/${editingTask.id}`, values);
      setEditingTask(null);
      resetForm();
      fetchTasks();
      toast.success('Task updated successfully!');
    } catch (err) {
      setError('Failed to update task');
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`);
      fetchTasks();
      toast.success('Task deleted successfully!');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      {error && <p className="error">{error}</p>}
      
      <Formik
        initialValues={editingTask || { title: '', description: '', category_id: '', priority: 'low', due_date: '' }}
        validationSchema={taskSchema}
        onSubmit={editingTask ? handleEditSubmit : handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            <div className="form-group">
              <label>Title</label>
              <Field type="text" name="title" />
              <ErrorMessage name="title" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <Field as="textarea" name="description" />
              <ErrorMessage name="description" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <Field as="select" name="category_id">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Field>
              <ErrorMessage name="category_id" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <Field as="select" name="priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
              <ErrorMessage name="priority" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <Field type="date" name="due_date" />
              <ErrorMessage name="due_date" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && <button type="button" onClick={cancelEditing}>Cancel</button>}
          </Form>
        )}
      </Formik>

      <div className="task-list">
        <h3>Task List</h3>
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.category ? task.category.name : 'Uncategorized'}</td>
                <td>{task.priority}</td>
                <td>{task.due_date}</td>
                <td>
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
