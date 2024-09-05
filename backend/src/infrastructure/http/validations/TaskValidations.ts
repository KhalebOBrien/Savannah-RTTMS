import * as Yup from 'yup';

export const taskSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  description: Yup.string().max(500),
  completed: Yup.boolean().default(false),
  userId: Yup.string().required('User ID is required'),
});
