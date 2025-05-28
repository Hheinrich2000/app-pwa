import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Users, 
  Building, 
  ClipboardList, 
  FileSpreadsheet,
  LogOut,
  BarChart3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const modules = [
    {
      title: 'Manage Workplaces',
      description: 'Create and manage workplace locations',
      icon: <Building className="h-10 w-10 text-blue-500" />,
      link: '/admin/workplaces',
      color: 'bg-blue-50'
    },
    {
      title: 'Manage Workers',
      description: 'Add, edit, and assign workers to workplaces',
      icon: <Users className="h-10 w-10 text-green-500" />,
      link: '/admin/workers',
      color: 'bg-green-50'
    },
    {
      title: 'Task Assignment',
      description: 'Create and assign tasks to workers',
      icon: <ClipboardList className="h-10 w-10 text-amber-500" />,
      link: '/admin/tasks',
      color: 'bg-amber-50'
    },
    {
      title: 'Reports',
      description: 'Generate and export worker and workplace reports',
      icon: <FileSpreadsheet className="h-10 w-10 text-purple-500" />,
      link: '/admin/reports',
      color: 'bg-purple-50'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Info */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Welcome, {user?.name}</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-base capitalize">{user?.role || 'N/A'}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Dashboard Overview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border border-blue-100">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Active Workers</p>
                    <p className="text-2xl font-bold text-blue-700">12</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-green-50 border border-green-100">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Workplaces</p>
                    <p className="text-2xl font-bold text-green-700">4</p>
                  </div>
                  <Building className="h-10 w-10 text-green-500" />
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-amber-50 border border-amber-100">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-900">Tasks Assigned</p>
                    <p className="text-2xl font-bold text-amber-700">23</p>
                  </div>
                  <ClipboardList className="h-10 w-10 text-amber-500" />
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-purple-50 border border-purple-100">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Check-ins Today</p>
                    <p className="text-2xl font-bold text-purple-700">8</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-purple-500" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        
        {/* Modules */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Administration Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <Link key={index} to={module.link} className="block">
                <Card className="h-full transition-all duration-200 hover:shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg ${module.color} mr-4`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{module.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;