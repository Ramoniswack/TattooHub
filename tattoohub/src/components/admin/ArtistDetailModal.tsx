'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Artist } from '@/types';
import { updateArtist, approveArtist, rejectArtist, deleteArtist } from '@/lib/firebase/database';
import { Star, MapPin, DollarSign, CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';

interface ArtistDetailModalProps {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ArtistDetailModal({ artist, isOpen, onClose, onUpdate }: ArtistDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Artist>>(artist || {});

  if (!artist) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateArtist(artist.id, formData);
      alert('Artist updated successfully!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating artist:', error);
      alert('Failed to update artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this artist?')) return;
    try {
      setIsLoading(true);
      await approveArtist(artist.id);
      alert('Artist approved successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error approving artist:', error);
      alert('Failed to approve artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this artist?')) return;
    try {
      setIsLoading(true);
      await rejectArtist(artist.id);
      alert('Artist rejected successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error rejecting artist:', error);
      alert('Failed to reject artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this artist? This action cannot be undone.')) return;
    try {
      setIsLoading(true);
      await deleteArtist(artist.id);
      alert('Artist deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting artist:', error);
      alert('Failed to delete artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Artist Details</span>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            View and manage artist information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={artist.avatar} />
              <AvatarFallback className="text-2xl">
                {artist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{artist.name}</h3>
                <Badge className={artist.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {artist.approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{artist.email}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{artist.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-400">({artist.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.location || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${artist.hourlyRate}/hr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input
                  id="specialties"
                  value={formData.specialties?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    specialties: e.target.value.split(',').map(s => s.trim()) 
                  })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(artist);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Bio</Label>
                <p className="text-sm text-gray-700 mt-1">{artist.bio || 'No bio provided'}</p>
              </div>

              <div>
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {artist.specialties?.length > 0 ? (
                    artist.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">{specialty}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No specialties listed</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Portfolio</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {artist.portfolio?.length > 0 ? (
                    artist.portfolio.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No portfolio images</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Account Created</Label>
                <p className="text-sm text-gray-700 mt-1">
                  {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              {!artist.approved && (
                <Button 
                  onClick={handleApprove} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Artist
                </Button>
              )}
              {artist.approved && (
                <Button 
                  onClick={handleReject} 
                  disabled={isLoading}
                  variant="outline"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke Approval
                </Button>
              )}
              <Button 
                onClick={handleDelete} 
                disabled={isLoading}
                variant="destructive"
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Artist
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
