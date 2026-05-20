import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Loader2, Plus, Trash2, Edit2, Check, Clock } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    service: 'grooming',
    date: '',
    time: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    setLoading(true);
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentsQuery = query(appointmentsCollection, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600 hover:bg-green-700';
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'completed':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'cancelled':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setFormData({
        petName: '',
        ownerName: '',
        service: 'grooming',
        date: '',
        time: '',
        status: 'pending',
        notes: '',
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleEditAppointment = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'appointments', editingAppointment.id), {
        ...formData,
        updatedAt: new Date(),
      });
      setFormData({
        petName: '',
        ownerName: '',
        service: 'grooming',
        date: '',
        time: '',
        status: 'pending',
        notes: '',
      });
      setEditingAppointment(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteDoc(doc(db, 'appointments', appointmentId));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: newStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openEditDialog = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      petName: appointment.petName || '',
      ownerName: appointment.ownerName || '',
      service: appointment.service || 'grooming',
      date: appointment.date || '',
      time: appointment.time || '',
      status: appointment.status || 'pending',
      notes: appointment.notes || '',
    });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingAppointment(null);
    setFormData({
      petName: '',
      ownerName: '',
      service: 'grooming',
      date: '',
      time: '',
      status: 'pending',
      notes: '',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments</h1>
            <p className="text-slate-600 mt-2">Manage and update all appointments</p>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                <DialogDescription>
                  {editingAppointment ? 'Update appointment details' : 'Create a new appointment'}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-slate-900">Pet Name</label>
                  <Input
                    placeholder="Buddy"
                    value={formData.petName}
                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Owner Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Service</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
                  >
                    <option value="grooming">Grooming</option>
                    <option value="checkup">Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="training">Training</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Notes</label>
                  <Input
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingAppointment ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Total Appointments</CardTitle>
              <Clock className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-slate-500">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-slate-500">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Confirmed</CardTitle>
              <Check className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedCount}</div>
              <p className="text-xs text-slate-500">Ready to go</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Management</CardTitle>
            <CardDescription>Manage and update all incoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                      No appointments yet
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.petName || 'N/A'}</TableCell>
                      <TableCell>{appointment.ownerName || 'N/A'}</TableCell>
                      <TableCell className="capitalize">{appointment.service || 'N/A'}</TableCell>
                      <TableCell>
                        {appointment.date} {appointment.time}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(appointment)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="gap-2 cursor-pointer"
                            >
                              <Check className="h-4 w-4" />
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              className="gap-2 cursor-pointer"
                            >
                              <Check className="h-4 w-4" />
                              Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="gap-2 cursor-pointer text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}