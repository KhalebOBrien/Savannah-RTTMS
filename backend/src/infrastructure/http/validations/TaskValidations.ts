import * as Yup from 'yup';

export const taskSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  description: Yup.string().max(500),
  completed: Yup.boolean().default(false),
});

export const taskIdSchema = Yup.object({
  id: Yup.string()
    .length(24, 'Task ID must be 24 characters long')
    .required('Task ID is required'),
});
