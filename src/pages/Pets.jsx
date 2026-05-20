import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { MoreHorizontal, Plus, Loader2, Trash2, Edit2, Search, Upload } from 'lucide-react';

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    owner: '',
    age: '',
    status: 'active',
    imageUrl: '',
  });

  useEffect(() => {
    setLoading(true);
    const petsCollection = collection(db, 'pets');
    const petsQuery = query(petsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(petsQuery, (snapshot) => {
      const petsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petsList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'pets'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        owner: '',
        age: '',
        status: 'active',
        imageUrl: '',
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  const handleEditPet = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'pets', editingPet.id), {
        ...formData,
        updatedAt: new Date(),
      });
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        owner: '',
        age: '',
        status: 'active',
        imageUrl: '',
      });
      setEditingPet(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deleteDoc(doc(db, 'pets', petId));
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  const openEditDialog = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name || '',
      type: pet.type || 'dog',
      breed: pet.breed || '',
      owner: pet.owner || '',
      age: pet.age || '',
      status: pet.status || 'active',
      imageUrl: pet.imageUrl || '',
    });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingPet(null);
    setFormData({
      name: '',
      type: 'dog',
      breed: '',
      owner: '',
      age: '',
      status: 'active',
      imageUrl: '',
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pets</h1>
            <p className="text-slate-600 mt-2">Manage all registered pets in the system</p>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
                <DialogDescription>
                  {editingPet ? 'Update pet information' : 'Register a new pet'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={editingPet ? handleEditPet : handleAddPet} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">Pet Name</label>
                  <Input
                    placeholder="Buddy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Breed</label>
                  <Input
                    placeholder="Golden Retriever"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Owner Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Age (years)</label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Image URL</label>
                  <Input
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-900">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingPet ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, breed, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pets Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-8 text-slate-500">
                      No pets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell className="font-medium">{pet.name || 'N/A'}</TableCell>
                      <TableCell className="capitalize">{pet.type || 'N/A'}</TableCell>
                      <TableCell>{pet.breed || 'N/A'}</TableCell>
                      <TableCell>{pet.owner || 'N/A'}</TableCell>
                      <TableCell>{pet.age ? `${pet.age} yrs` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={pet.status === 'active' ? 'default' : 'secondary'}
                          className={
                            pet.status === 'active'
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-slate-400'
                          }
                        >
                          {pet.status || 'Active'}
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
                              onClick={() => openEditDialog(pet)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeletePet(pet.id)}
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
};

export default Pets;