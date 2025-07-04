
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddRestaurantFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddRestaurantForm = ({ onClose, onSuccess }: AddRestaurantFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    PASSWORD: '',
    description: '',
    logo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (3MB limit)
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Image size too large",
        description: "Image size cannot exceed 3MB.",
        variant: "destructive",
      });
      // Clear the file input
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('https://menu-backend-56ur.onrender.com/api/upload/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log('Logo uploaded successfully:', data.imageUrl);
      
      // Update the form data with the uploaded image URL
      setFormData(prev => ({ ...prev, logo: data.imageUrl }));
      
      toast({
        title: "Logo uploaded",
        description: "Logo uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
      // Clear the file input on error
      e.target.value = '';
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.username.trim() || !formData.PASSWORD.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, username, password).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://menu-backend-56ur.onrender.com/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          PASSWORD: formData.PASSWORD,
          description: formData.description,
          logo: formData.logo,
          status: 'active',
          created_by: 'admin'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }

      toast({
        title: "Success!",
        description: "Restaurant created successfully.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to create restaurant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add New Restaurant</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter restaurant name"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.PASSWORD}
                onChange={(e) => handleInputChange('PASSWORD', e.target.value)}
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter restaurant description"
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Logo
              </Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage || isLoading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {isUploadingImage && (
                  <p className="text-sm text-gray-600">Uploading logo...</p>
                )}
                {formData.logo && (
                  <p className="text-sm text-gray-600">
                    Logo uploaded: {formData.logo.substring(0, 50)}...
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploadingImage}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? 'Creating...' : 'Create Restaurant'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRestaurantForm;
