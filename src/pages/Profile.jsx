import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../AuthContext';
import { Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: user?.email || 'admin@fitfurs.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Pet Care Administrator',
  });

  const handleSave = () => {
    // Here you would save to Firebase
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const userEmail = user?.email || 'user@fitfurs.com';
  const userName = userEmail.split('@')[0];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-2">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and edit your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                  <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Button className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>

              {/* Profile Form */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-900">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                      rows="4"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600 w-32">Full Name:</span>
                    <span className="text-slate-900">{formData.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 w-28">Email:</span>
                    <span className="text-slate-900">{formData.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 w-28">Phone:</span>
                    <span className="text-slate-900">{formData.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 w-28">Location:</span>
                    <span className="text-slate-900">{formData.location}</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-600">Bio:</span>
                    <p className="text-slate-900 mt-1">{formData.bio}</p>
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account security and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Connected Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
