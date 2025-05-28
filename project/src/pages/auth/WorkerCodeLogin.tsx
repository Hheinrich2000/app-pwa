import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { HardHat, Building2 } from 'lucide-react';

const WorkerCodeLogin: React.FC = () => {
  const [workerCode, setWorkerCode] = useState('');
  const { loginWithWorkerCode, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithWorkerCode(workerCode);
      localStorage.setItem('lastLoginMethod', 'worker');
      navigate('/worker');
    } catch (error) {
      // Error is handled in the auth store
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <HardHat className="h-12 w-auto text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Worker Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your worker code to sign in
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Worker Sign In</h3>
          </CardHeader>
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="workerCode" className="block text-sm font-medium text-gray-700">
                  Worker Code
                </label>
                <div className="mt-1">
                  <input
                    id="workerCode"
                    name="workerCode"
                    type="text"
                    required
                    value={workerCode}
                    onChange={(e) => setWorkerCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your unique worker code"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
            </form>
          </CardBody>
          <CardFooter className="flex justify-center">
            <Link
              to="/login"
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <Building2 className="mr-2 h-4 w-4" />
              I'm an administrator
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WorkerCodeLogin;