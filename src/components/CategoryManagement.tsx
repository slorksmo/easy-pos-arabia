
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
}

const CategoryManagement = ({ categories, onCategoriesUpdate }: CategoryManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6"
  });
  
  const { toast } = useToast();

  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      color: formData.color
    };

    if (editingCategory) {
      const updatedCategories = categories.map(c => c.id === editingCategory.id ? newCategory : c);
      onCategoriesUpdate(updatedCategories);
      toast({
        title: "تم تحديث الفئة",
        description: `تم تحديث فئة ${newCategory.name} بنجاح`,
      });
    } else {
      onCategoriesUpdate([...categories, newCategory]);
      toast({
        title: "تم إضافة الفئة",
        description: `تم إضافة فئة ${newCategory.name} بنجاح`,
      });
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", color: "#3B82F6" });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    onCategoriesUpdate(updatedCategories);
    toast({
      title: "تم حذف الفئة",
      description: "تم حذف الفئة بنجاح",
    });
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Tag className="w-5 h-5" />
            إدارة الفئات
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={() => {
                  setEditingCategory(null);
                  setFormData({ name: "", description: "", color: "#3B82F6" });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة فئة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-right">اسم الفئة *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم الفئة"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-right">وصف الفئة</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف اختياري للفئة"
                  />
                </div>
                <div>
                  <Label className="text-right">لون الفئة</Label>
                  <div className="flex gap-2 mt-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                    {editingCategory ? "تحديث" : "إضافة"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-3 bg-white rounded-lg border border-blue-100 flex items-center justify-between group hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <span className="font-medium text-sm">{category.name}</span>
                  {category.description && (
                    <p className="text-xs text-gray-500">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(category)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(category.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد فئات محددة</p>
            <p className="text-sm mt-2">قم بإضافة فئة جديدة لتنظيم المنتجات</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
