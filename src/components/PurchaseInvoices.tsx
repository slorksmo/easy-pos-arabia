
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Calendar, Building, Package, Receipt, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface InvoiceItem {
  productName: string;
  barcode: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  category: string;
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  date: string;
  time: string;
  items: InvoiceItem[];
  total: number;
}

const PurchaseInvoices = () => {
  const [categories] = useState<Category[]>([
    { id: "1", name: "مشروبات", color: "#3B82F6" },
    { id: "2", name: "وجبات خفيفة", color: "#10B981" },
    { id: "3", name: "حلويات", color: "#F59E0B" }
  ]);

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-001",
      supplier: "شركة التوزيع الشاملة",
      date: "2024-01-15",
      time: "10:30",
      items: [
        { productName: "كوكا كولا", barcode: "1234567890123", quantity: 50, purchasePrice: 2, salePrice: 2.5, category: "مشروبات" },
        { productName: "شيبس", barcode: "1234567890124", quantity: 30, purchasePrice: 1, salePrice: 1.5, category: "وجبات خفيفة" }
      ],
      total: 130
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    supplier: "",
    date: ""
  });
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { productName: "", barcode: "", quantity: 0, purchasePrice: 0, salePrice: 0, category: "" }
  ]);

  const { toast } = useToast();

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { productName: "", barcode: "", quantity: 0, purchasePrice: 0, salePrice: 0, category: "" }]);
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoiceItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setInvoiceItems(updatedItems);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.quantity * item.purchasePrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceData.invoiceNumber || !invoiceData.supplier || !invoiceData.date) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع بيانات الفاتورة",
        variant: "destructive"
      });
      return;
    }

    const validItems = invoiceItems.filter(item => item.productName && item.quantity > 0);
    
    if (validItems.length === 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إضافة منتج واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    const newInvoice: PurchaseInvoice = {
      id: Date.now().toString(),
      ...invoiceData,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      items: validItems,
      total: calculateTotal()
    };

    setInvoices([newInvoice, ...invoices]);
    
    toast({
      title: "تم إضافة الفاتورة",
      description: `تم إضافة فاتورة الشراء ${invoiceData.invoiceNumber} بنجاح`,
    });

    setIsAddDialogOpen(false);
    setInvoiceData({ invoiceNumber: "", supplier: "", date: "" });
    setInvoiceItems([{ productName: "", barcode: "", quantity: 0, purchasePrice: 0, salePrice: 0, category: "" }]);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || "#6B7280";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="w-6 h-6" />
                فواتير الشراء
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                إجمالي الفواتير: {invoices.length} فاتورة
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة فاتورة شراء
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة فاتورة شراء جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Invoice Header */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">رقم الفاتورة *</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                        placeholder="INV-001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier">المورد *</Label>
                      <Input
                        id="supplier"
                        value={invoiceData.supplier}
                        onChange={(e) => setInvoiceData({ ...invoiceData, supplier: e.target.value })}
                        placeholder="اسم المورد"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">تاريخ الفاتورة *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg font-semibold">بنود الفاتورة</Label>
                      <Button type="button" variant="outline" onClick={addInvoiceItem}>
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة بند
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {invoiceItems.map((item, index) => (
                        <Card key={index} className="p-4 bg-blue-50 border-blue-200">
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                            <div>
                              <Label>اسم المنتج</Label>
                              <Input
                                value={item.productName}
                                onChange={(e) => updateInvoiceItem(index, 'productName', e.target.value)}
                                placeholder="اسم المنتج"
                              />
                            </div>
                            <div>
                              <Label>الباركود</Label>
                              <Input
                                value={item.barcode}
                                onChange={(e) => updateInvoiceItem(index, 'barcode', e.target.value)}
                                placeholder="1234567890123"
                              />
                            </div>
                            <div>
                              <Label>الفئة</Label>
                              <Select 
                                value={item.category} 
                                onValueChange={(value) => updateInvoiceItem(index, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر الفئة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-3 h-3 rounded-full"
                                          style={{ backgroundColor: category.color }}
                                        />
                                        {category.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>الكمية</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label>سعر الشراء</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.purchasePrice}
                                onChange={(e) => updateInvoiceItem(index, 'purchasePrice', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label>سعر البيع</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.salePrice}
                                onChange={(e) => updateInvoiceItem(index, 'salePrice', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeInvoiceItem(index)}
                                disabled={invoiceItems.length === 1}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>إجمالي الفاتورة:</span>
                      <span className="text-blue-600">{calculateTotal().toFixed(2)} ريال</span>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                      حفظ الفاتورة
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Purchase Invoices List */}
      <Card className="bg-white/60 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Receipt className="w-5 h-5" />
            قائمة فواتير الشراء ({invoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد فواتير شراء حتى الآن</p>
              <p className="text-sm mt-2">قم بإضافة فاتورة شراء جديدة لتظهر هنا</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsInvoiceDialogOpen(true);
                      }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            {invoice.invoiceNumber}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {invoice.items.length} منتج
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {invoice.date} - {invoice.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {invoice.supplier}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-blue-600">
                          {invoice.total.toFixed(2)} ريال
                        </div>
                        <Button variant="ghost" size="sm" className="mt-1">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              تفاصيل فاتورة الشراء {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">رقم الفاتورة</span>
                  <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">التاريخ</span>
                  <p className="font-semibold">{selectedInvoice.date}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">الوقت</span>
                  <p className="font-semibold">{selectedInvoice.time}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">المورد</span>
                  <p className="font-semibold">{selectedInvoice.supplier}</p>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <h3 className="text-lg font-semibold mb-4">تفاصيل المنتجات</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنتج</TableHead>
                      <TableHead className="text-right">الباركود</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">سعر الشراء</TableHead>
                      <TableHead className="text-right">سعر البيع</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.barcode}</TableCell>
                        <TableCell>
                          {item.category && (
                            <Badge 
                              className="text-white text-xs"
                              style={{ backgroundColor: getCategoryColor(item.category) }}
                            >
                              {item.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.purchasePrice.toFixed(2)} ريال</TableCell>
                        <TableCell className="text-green-600 font-medium">{item.salePrice.toFixed(2)} ريال</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-semibold">
                          {(item.purchasePrice * item.quantity).toFixed(2)} ريال
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Invoice Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-blue-600">{selectedInvoice.total.toFixed(2)} ريال</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)} className="flex-1">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseInvoices;
