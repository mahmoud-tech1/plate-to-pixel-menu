
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X, Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { sanitizeHtml } from '@/utils/htmlSanitizer';

interface Restaurant {
  id: number;
  name: string;
  username: string;
  description: string;
  phone_number: string;
  logo: string;
  status: string;
}

interface RestaurantProfileEditProps {
  restaurant: Restaurant;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const RestaurantProfileEdit = ({ restaurant, isLoading, onSubmit, onCancel }: RestaurantProfileEditProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      description: '',
      phone_number: '',
      logo: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (restaurant) {
      console.log('Populating form with restaurant data:', restaurant);
      const statusValue = restaurant.status && restaurant.status.trim() !== '' ? restaurant.status : 'active';
      form.reset({
        name: restaurant.name || '',
        username: restaurant.username || '',
        description: restaurant.description || '',
        phone_number: restaurant.phone_number || '',
        logo: restaurant.logo || '',
        status: statusValue,
      });
      setLogoPreview(restaurant.logo || '');
    }
  }, [restaurant, form]);

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);

      const response = await fetch('https://menu-back.up.railway.app/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();
      return data.url || data.imageUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (data: any) => {
    let logoUrl = data.logo;

    // Upload new logo if selected
    if (logoFile) {
      const uploadedUrl = await uploadLogo();
      if (uploadedUrl) {
        logoUrl = uploadedUrl;
      } else {
        return; // Don't submit if logo upload failed
      }
    }

    onSubmit({
      ...data,
      logo: logoUrl,
      description: sanitizeHtml(data.description),
    });
  };

  const handleCancel = () => {
    const statusValue = restaurant.status && restaurant.status.trim() !== '' ? restaurant.status : 'active';
    form.reset({
      name: restaurant.name || '',
      username: restaurant.username || '',
      description: restaurant.description || '',
      phone_number: restaurant.phone_number || '',
      logo: restaurant.logo || '',
      status: statusValue,
    });
    setLogoFile(null);
    setLogoPreview(restaurant.logo || '');
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Restaurant Profile</h2>
        <Button
          onClick={handleCancel}
          variant="outline"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || 'active'}
                    defaultValue="active"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    value={field.value} 
                    onChange={field.onChange}
                    placeholder="Enter restaurant description with formatting..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Upload Section */}
          <div className="space-y-4">
            <FormLabel>Restaurant Logo</FormLabel>
            
            {/* Logo Preview */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button type="button" variant="outline" asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new logo image (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || uploadingLogo} 
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading || uploadingLogo ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantProfileEdit;
