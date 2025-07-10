
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, FileText, BarChart3, Plus, Search, Calculator, Receipt } from "lucide-react";
import SalesInterface from "@/components/SalesInterface";
import ProductManagement from "@/components/ProductManagement";
import PurchaseInvoices from "@/components/PurchaseInvoices";
import ReportsSection from "@/components/ReportsSection";
import SalesInvoices from "@/components/SalesInvoices";

const Index = () => {
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  نظام نقطة البيع
                </h1>
                <p className="text-sm text-gray-600">إدارة ذكية للمبيعات والمخزون</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                متصل
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                المتجر الرئيسي
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs - الترتيب من اليمين لليسار */}
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-blue-100 h-16" dir="rtl">
            <TabsTrigger 
              value="reports"
              className="flex-col gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">التقارير</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invoices"
              className="flex-col gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">فواتير الشراء</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sales-invoices"
              className="flex-col gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-xs">فواتير المبيعات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="flex-col gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Package className="w-5 h-5" />
              <span className="text-xs">المنتجات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="flex-col gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs">نقطة البيع</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="sales" className="m-0">
            <SalesInterface />
          </TabsContent>

          <TabsContent value="products" className="m-0">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="sales-invoices" className="m-0">
            <SalesInvoices />
          </TabsContent>

          <TabsContent value="invoices" className="m-0">
            <PurchaseInvoices />
          </TabsContent>

          <TabsContent value="reports" className="m-0">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
