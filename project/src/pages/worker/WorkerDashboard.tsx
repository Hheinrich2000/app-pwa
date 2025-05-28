import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { 
  CheckCircle, 
  LogOut, 
  MapPin, 
  ClipboardList, 
  Camera,
  Clock,
  MapPinned
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import TaskList from './components/TaskList';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to recenter map on location changes
const LocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  
  return (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const WorkerDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [showTasks, setShowTasks] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
          setLocationError(null);
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  }, []);
  
  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      setCheckInTime(new Date());
      setIsCheckedIn(true);
      // TODO: Save check-in to database
    } else {
      setCheckInTime(null);
      setIsCheckedIn(false);
      // TODO: Save check-out to database
    }
  };
  
  const handleLogout = async () => {
    await logout();
    // Navigate is handled by the protected route
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HardHat className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">Worker Dashboard</h1>
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
        {/* Worker Info */}
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Worker Information</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base font-medium">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Worker Code</p>
                <p className="text-base font-medium">{user?.worker_code || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned Workplace</p>
                <p className="text-base font-medium">
                  {user?.workplace_id ? 'Workplace #' + user.workplace_id : 'Not assigned'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned Hours</p>
                <p className="text-base font-medium">
                  {user?.assigned_hours ? `${user.assigned_hours} hours` : 'Not assigned'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Check-in Card */}
        <Card className="mb-6">
          <CardHeader className={isCheckedIn ? 'bg-green-50' : 'bg-blue-50'}>
            <h2 className="text-lg font-medium text-gray-800">
              {isCheckedIn ? 'Currently Checked In' : 'Check-in Status'}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                {isCheckedIn ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">
                      You checked in at {checkInTime?.toLocaleTimeString()}
                    </p>
                  </>
                ) : (
                  <>
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">You are not checked in</p>
                  </>
                )}
              </div>
              
              <Button 
                variant={isCheckedIn ? 'danger' : 'success'} 
                size="lg"
                onClick={handleCheckInOut}
                leftIcon={isCheckedIn ? <LogOut className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
              >
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </Button>
            </div>
          </CardBody>
        </Card>
        
        {/* Map and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-800">Your Location</h2>
              </CardHeader>
              <CardBody className="p-0 h-96">
                {locationError ? (
                  <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                    <div className="text-center text-red-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p>{locationError}</p>
                    </div>
                  </div>
                ) : position ? (
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker position={position} />
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center text-gray-500">
                      <MapPinned className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                      <p>Getting your location...</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-800">Actions</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    leftIcon={<ClipboardList className="h-5 w-5" />}
                    onClick={() => setShowTasks(!showTasks)}
                  >
                    {showTasks ? 'Hide Tasks' : 'View Tasks'}
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<Camera className="h-5 w-5" />}
                    onClick={() => setShowCamera(!showCamera)}
                  >
                    {showCamera ? 'Hide Camera' : 'Take Photo'}
                  </Button>
                </div>
              </CardBody>
            </Card>
            
            {/* Show tasks when button is clicked */}
            {showTasks && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-gray-800">Your Tasks</h2>
                </CardHeader>
                <CardBody>
                  <TaskList workerId={user?.id || ''} />
                </CardBody>
              </Card>
            )}
            
            {/* Show camera when button is clicked */}
            {showCamera && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-gray-800">Take a Photo</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Take a photo or upload from your device
                      </p>
                      <div className="mt-3">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="sr-only"
                          id="camera-input"
                        />
                        <label htmlFor="camera-input">
                          <Button variant="outline" size="sm" type="button">
                            Take Photo
                          </Button>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                        Add a note
                      </label>
                      <textarea
                        id="note"
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Add details about this photo..."
                      ></textarea>
                    </div>
                    <Button variant="primary" size="sm">
                      Submit
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// This component is referenced above but not defined
const HardHat = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
    <path d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"/>
  </svg>
);

export default WorkerDashboard;