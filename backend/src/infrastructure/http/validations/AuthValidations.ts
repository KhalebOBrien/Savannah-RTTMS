import * as Yup from 'yup';

export const registerSchema = Yup.object({
  username: Yup.string().min(3).max(20).required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8).required('Password is required'),
});

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8).required('Password is required'),
});
