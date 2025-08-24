import { useState, useEffect } from 'react';
import { Search, Eye, UserX, UserCheck, Trash2, MapPin, Calendar, Headphones, Plus, Phone, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    city: '',
    country: '',
    bio: ''
  });
  
  const { users, loading, addUser, banUser, unbanUser, deleteUser, stats } = useUsers();

  // Enhanced user data with additional fields
  const enhancedUsers = users.map(user => ({
    ...user,
    country: user.country || 'غير محدد',
    city: user.city || 'غير محدد',
    booksRead: Math.floor(Math.random() * 50) + 10,
    totalListeningTime: `${Math.floor(Math.random() * 200) + 50} ساعة`,
    status: user.is_banned ? 'banned' : user.email_confirmed_at ? 'active' : 'inactive'
  }));

  const filteredUsers = enhancedUsers.filter(user => {
    const matchesSearch = (user.name || user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || user.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const handleAddUser = async () => {
    if (newUser.email.trim() && newUser.password.trim()) {
      const result = await addUser(newUser);
      if (result.success) {
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          city: '',
          country: '',
          bio: ''
        });
        setIsAddDialogOpen(false);
      }
    }
  };
  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.is_banned) {
      await unbanUser(userId);
    } else {
      await banUser(userId);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'banned': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'banned': return 'محظور';
      case 'inactive': return 'غير نشط';
      default: return 'غير محدد';
    }
  };

  const uniqueCountries = [...new Set(enhancedUsers.map(user => user.country))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة المستخدمين</h1>
          <p className="text-text-secondary mt-1">إدارة ومراقبة حسابات المستخدمين</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-elegant"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة مستخدم جديد</DialogTitle>
              <DialogDescription className="text-right">
                أدخل بيانات المستخدم الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-right block">البريد الإلكتروني*</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="أدخل البريد الإلكتروني"
                  className="text-right"
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-right block">كلمة المرور*</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="أدخل كلمة المرور"
                  className="text-right"
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="full_name" className="text-right block">الاسم الكامل</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  placeholder="أدخل الاسم الكامل"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-right block">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                  className="text-right"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-right block">المدينة</Label>
                  <Input
                    id="city"
                    value={newUser.city}
                    onChange={(e) => setNewUser({...newUser, city: e.target.value})}
                    placeholder="المدينة"
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-right block">الدولة</Label>
                  <Input
                    id="country"
                    value={newUser.country}
                    onChange={(e) => setNewUser({...newUser, country: e.target.value})}
                    placeholder="الدولة"
                    className="text-right"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio" className="text-right block">نبذة شخصية</Label>
                <Textarea
                  id="bio"
                  value={newUser.bio}
                  onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                  placeholder="أدخل نبذة شخصية"
                  className="text-right"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="flex-row-reverse">
              <Button 
                onClick={handleAddUser}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                إضافة المستخدم
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalUsers}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent-glow/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">المستخدمين النشطين</p>
                <p className="text-2xl font-bold text-text-primary">{stats.activeUsers}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary-glow/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">المستخدمين المحظورين</p>
                <p className="text-2xl font-bold text-text-primary">{stats.bannedUsers}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-tertiary/10 to-tertiary-glow/10 border-tertiary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي الكتب المقروءة</p>
                <p className="text-2xl font-bold text-text-primary">{enhancedUsers.reduce((sum, user) => sum + user.booksRead, 0)}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-tertiary rounded-xl flex items-center justify-center">
                <Headphones className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-admin">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-text-primary">قائمة المستخدمين</CardTitle>
              <CardDescription className="text-text-secondary">
                إدارة ومراقبة حسابات المستخدمين المسجلين
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="البحث في المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full sm:w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="banned">محظور</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدول</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-secondary">
                  <TableHead className="text-right font-semibold">المستخدم</TableHead>
                  <TableHead className="text-right font-semibold">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right font-semibold">الموقع</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right font-semibold">آخر نشاط</TableHead>
                  <TableHead className="text-right font-semibold">الكتب المقروءة</TableHead>
                  <TableHead className="text-right font-semibold">وقت الاستماع</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} />
                           <AvatarFallback className="bg-gradient-primary text-white">
                             {(user.name || 'م').charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                         <div>
                           <div className="font-medium text-text-primary">{user.name || 'مستخدم جديد'}</div>
                           <div className="text-sm text-text-secondary">{user.phone || 'غير محدد'}</div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{user.email || 'غير محدد'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="h-4 w-4" />
                        <span>{user.city}, {user.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(user.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ar-EG') : 'لم يدخل بعد'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-primary">
                        {user.booksRead} كتاب
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">{user.totalListeningTime}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="h-8 w-8 p-0 hover:bg-accent/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-right">تفاصيل المستخدم</DialogTitle>
                              <DialogDescription className="text-right">
                                معلومات تفصيلية عن المستخدم
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                   <Avatar className="h-16 w-16">
                                     <AvatarImage src={selectedUser.avatar_url} />
                                     <AvatarFallback className="bg-gradient-primary text-white text-lg">
                                       {(selectedUser.name || 'م').charAt(0)}
                                     </AvatarFallback>
                                   </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                                    <p className="text-text-secondary">{selectedUser.email}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                   <div>
                                     <span className="font-medium">رقم الهاتف:</span>
                                     <p className="text-text-secondary">{selectedUser.phone || 'غير محدد'}</p>
                                   </div>
                                  <div>
                                    <span className="font-medium">الموقع:</span>
                                    <p className="text-text-secondary">{selectedUser.city}, {selectedUser.country}</p>
                                  </div>
                                   <div>
                                     <span className="font-medium">تاريخ التسجيل:</span>
                                     <p className="text-text-secondary">{new Date(selectedUser.created_at).toLocaleDateString('ar-EG')}</p>
                                   </div>
                                   <div>
                                     <span className="font-medium">آخر نشاط:</span>
                                     <p className="text-text-secondary">
                                       {selectedUser.last_sign_in_at ? new Date(selectedUser.last_sign_in_at).toLocaleDateString('ar-EG') : 'لم يدخل بعد'}
                                     </p>
                                   </div>
                                  <div>
                                    <span className="font-medium">الكتب المقروءة:</span>
                                    <p className="text-text-secondary">{selectedUser.booksRead} كتاب</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">وقت الاستماع:</span>
                                    <p className="text-text-secondary">{selectedUser.totalListeningTime}</p>
                                  </div>
                                  {selectedUser.bio && (
                                    <div className="col-span-2">
                                      <span className="font-medium">النبذة الشخصية:</span>
                                      <p className="text-text-secondary">{selectedUser.bio}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`h-8 w-8 p-0 ${user.status === 'banned' ? 'hover:bg-accent/20' : 'hover:bg-destructive/20 text-destructive'}`}
                        >
                          {user.status === 'banned' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}