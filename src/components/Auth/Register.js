import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axios';
import '../../styles/Auth.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
       await api.post('/register', {
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        name: values.name,
      });
      await login(values.email, values.password);
      toast.success('Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to register');
      setErrors({ submit: 'Failed to register. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div className="form-group">
              <label>name</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <Field type="password" name="confirm_password" />
              <ErrorMessage name="confirm_password" component="div" className="error" />
            </div>
            {errors.submit && <div className="error">{errors.submit}</div>}
            <button type="submit" disabled={isSubmitting}>Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
