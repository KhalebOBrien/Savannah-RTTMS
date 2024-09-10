import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../store/slices/taskSlice';
import { AppDispatch, RootState } from '../store';
import InputBox from '../components/InputBox';
import LayoutWrapper from '../components/Layout';
import Button from '../components/Button';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks,
  );

  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editableTaskId, setEditableTaskId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState({ title: '', description: '' });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createTask({
        title: newTask.title,
        description: newTask.description,
        completed: false,
      }),
    );
    setNewTask({ title: '', description: '' });
  };

  const handleUpdateTask = (taskId: string) => {
    dispatch(
      updateTask({
        id: taskId,
        title: editTask.title,
        description: editTask.description,
        completed: false,
      }),
    );
    setEditableTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <LayoutWrapper>
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>

        {/* Task Creation Form */}
        <form onSubmit={handleCreateTask} className="mb-4">
          <div className="mb-2">
            <InputBox
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <InputBox
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>
          <Button
            text="Create Task"
            type="submit"
            classes="text-lightBlack px-4 py-2"
          />
        </form>

        {loading ? <p>Loading...</p> : null}
        {error ? <p className="text-red-500">{error}</p> : null}

        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded shadow-sm bg-gray">
              {editableTaskId === task.id ? (
                <>
                  {/* Edit Task Form */}
                  <div className="mb-2">
                    <InputBox
                      type="text"
                      placeholder="Task Title"
                      value={editTask.title}
                      onChange={(e) =>
                        setEditTask({ ...editTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <InputBox
                      type="text"
                      placeholder="Task Description"
                      value={editTask.description}
                      onChange={(e) =>
                        setEditTask({
                          ...editTask,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    text="Save"
                    type="button"
                    classes="text-lightBlack px-4 py-2 mr-2"
                    onClick={() => handleUpdateTask(task.id)}
                  />
                  <Button
                    text="Cancel"
                    type="button"
                    classes="border border-white text-white bg-gray px-4 py-2"
                    onClick={() => setEditableTaskId(null)}
                  />
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    {task.completed ? 'Completed' : 'Pending'}
                  </p>
                  <div className="mt-2 space-x-2">
                    <Button
                      text="Edit"
                      type="button"
                      classes="bg-yellow-500 text-white px-4 py-2"
                      onClick={() => {
                        setEditableTaskId(task.id);
                        setEditTask({
                          title: task.title,
                          description: task.description,
                        });
                      }}
                    />
                    <Button
                      text="Delete"
                      type="button"
                      classes="bg-red-500 text-white px-4 py-2"
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </LayoutWrapper>
  );
};

export default TaskList;
