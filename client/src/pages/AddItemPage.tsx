import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Upload, X, ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "Camping & Outdoors",
  "Tools & Equipment",
  "Sports & Recreation",
  "Kitchen & Appliances",
  "Electronics",
  "Books & Media",
  "Clothing & Accessories",
  "Transportation",
  "Party & Events",
  "Other",
];

const addItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

type AddItemFormData = z.infer<typeof addItemSchema>;

export default function AddItemPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUploadedImageUrl(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setUploadedImageUrl(null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Get presigned upload URL
      const response: { uploadURL: string } = await apiRequest("POST", "/api/objects/upload", {});

      // Upload file to GCS
      const uploadResponse = await fetch(response.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Extract object path from URL
      const url = new URL(response.uploadURL);
      const objectPath = decodeURIComponent(url.pathname.split("/").slice(2).join("/"));

      // Set ACL to public so anyone can view it
      await apiRequest("PUT", "/api/items/image", {
        objectPath,
        public: true,
      });

      return objectPath;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: AddItemFormData) => {
    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await apiRequest("POST", "/api/items", {
        name: data.name,
        description: data.description,
        category: data.category,
        imageUrl,
        status: "available",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/items"] });

      toast({
        title: "Item added!",
        description: "Your item is now visible to friends",
      });

      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Failed to add item",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Share Something
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Photo (optional)</label>
                  {!uploadedImageUrl ? (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover-elevate transition-colors"
                      data-testid="button-upload-image"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={uploadedImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        data-testid="img-preview"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                        data-testid="button-remove-image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Camping tent, power drill, road bike..."
                          data-testid="input-item-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is it? Any details friends should know?"
                          className="min-h-32"
                          data-testid="textarea-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={form.formState.isSubmitting || isUploading}
                  data-testid="button-submit-item"
                >
                  {form.formState.isSubmitting || isUploading
                    ? "Adding item..."
                    : "Add Item"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
