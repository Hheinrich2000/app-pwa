import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Task } from '../../../types';

interface TaskListProps {
  workerId: string;
}

const TaskList: React.FC<TaskListProps> = ({ workerId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching tasks from an API
    setIsLoading(true);
    
    // In a real application, you would fetch from your database
    setTimeout(() => {
      // Mock data for demonstration
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Inspect equipment',
          description: 'Perform routine inspection of all equipment in sector A',
          workplace_id: 'workplace1',
          assigned_to: workerId,
          status: 'pending',
          created_by: 'admin1',
          created_at: new Date(Date.now() - 86400000), // yesterday
          due_date: new Date(Date.now() + 86400000) // tomorrow
        },
        {
          id: '2',
          title: 'Clean work area',
          description: 'Make sure all tools are returned to their proper places',
          workplace_id: 'workplace1',
          assigned_to: workerId,
          status: 'completed',
          created_by: 'admin1',
          created_at: new Date(Date.now() - 172800000), // 2 days ago
          completed_at: new Date(Date.now() - 86400000) // yesterday
        },
        {
          id: '3',
          title: 'Submit daily report',
          description: 'Fill out the daily activity report and submit it to your supervisor',
          workplace_id: 'workplace1',
          assigned_to: workerId,
          status: 'pending',
          created_by: 'admin1',
          created_at: new Date(),
          due_date: new Date()
        }
      ];
      
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, [workerId]);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            completed_at: task.status === 'completed' ? undefined : new Date()
          } 
        : task
    ));
    
    // In a real app, you would update the task status in your database here
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center text-red-500">
        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>No tasks assigned to you yet.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map(task => (
        <li key={task.id} className="py-3">
          <div className="flex items-start">
            <div 
              className="flex-shrink-0 cursor-pointer mt-0.5" 
              onClick={() => toggleTaskStatus(task.id)}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 hover:text-blue-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.title}
              </p>
              <p className={`mt-1 text-xs ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-500'}`}>
                {task.description}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                {task.due_date && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    task.status === 'completed' 
                      ? 'bg-gray-100 text-gray-400' 
                      : new Date(task.due_date) < new Date() 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    Due: {task.due_date.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;