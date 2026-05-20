import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  const userEmail = user?.email || 'user@fitfurs.com';
  const userName = userEmail.split('@')[0];

  // Sample notifications
  const notifications = [
    { id: 1, message: 'New appointment booked', time: '5 minutes ago' },
    { id: 2, message: 'User registered', time: '1 hour ago' },
    { id: 3, message: 'Pet checkup reminder', time: '2 hours ago' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between fixed top-0 left-64 right-0 z-40">
      {/* Left side - title */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Admin Portal</h2>
      </div>

      {/* Right side - notifications and user menu */}
      <div className="flex items-center gap-4">
        {/* Notifications Popover */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-600 hover:text-slate-900"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <p className="text-sm text-slate-900">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Configure your dashboard preferences</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Theme */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Theme</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                  <option value="light">Light (Default)</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900">Notifications</label>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Language</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-900 capitalize">{userName}</p>
                <p className="text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNavigateToProfile} className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNavigateToSettings} className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-red-600">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;