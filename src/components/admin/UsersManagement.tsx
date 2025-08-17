import { useState } from 'react';
import { Search, Eye, UserX, UserCheck, Trash2, MapPin, Calendar, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    name: 'أحمد محمد علي',
    email: 'ahmed.mohammed@email.com',
    avatar: '/placeholder.svg',
    country: 'مصر',
    city: 'القاهرة',
    joinDate: '2024-01-15',
    lastActive: '2024-08-16',
    booksRead: 25,
    totalListeningTime: '120 ساعة',
    status: 'active',
    phoneNumber: '+20123456789'
  },
  {
    id: 2,
    name: 'فاطمة خالد',
    email: 'fatima.khaled@email.com',
    avatar: '/placeholder.svg',
    country: 'السعودية',
    city: 'الرياض',
    joinDate: '2024-01-10',
    lastActive: '2024-08-15',
    booksRead: 42,
    totalListeningTime: '189 ساعة',
    status: 'active',
    phoneNumber: '+966123456789'
  },
  {
    id: 3,
    name: 'محمد عبدالله',
    email: 'mohammed.abdullah@email.com',
    avatar: '/placeholder.svg',
    country: 'الإمارات',
    city: 'دبي',
    joinDate: '2024-01-08',
    lastActive: '2024-08-10',
    booksRead: 18,
    totalListeningTime: '95 ساعة',
    status: 'banned',
    phoneNumber: '+971123456789'
  },
  {
    id: 4,
    name: 'نور الهدى',
    email: 'nour.alhuda@email.com',
    avatar: '/placeholder.svg',
    country: 'الأردن',
    city: 'عمان',
    joinDate: '2024-01-05',
    lastActive: '2024-08-12',
    booksRead: 33,
    totalListeningTime: '156 ساعة',
    status: 'active',
    phoneNumber: '+962123456789'
  },
  {
    id: 5,
    name: 'عمر حسن',
    email: 'omar.hassan@email.com',
    avatar: '/placeholder.svg',
    country: 'المغرب',
    city: 'الدار البيضاء',
    joinDate: '2024-01-03',
    lastActive: '2024-08-14',
    booksRead: 12,
    totalListeningTime: '68 ساعة',
    status: 'inactive',
    phoneNumber: '+212123456789'
  },
];

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || user.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' }
        : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
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

  const uniqueCountries = [...new Set(users.map(user => user.country))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">إدارة المستخدمين</h1>
          <p className="text-text-secondary mt-1">إدارة ومراقبة حسابات المستخدمين</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-text-primary">{users.length}</p>
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
                <p className="text-2xl font-bold text-text-primary">{users.filter(u => u.status === 'active').length}</p>
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
                <p className="text-2xl font-bold text-text-primary">{users.filter(u => u.status === 'banned').length}</p>
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
                <p className="text-2xl font-bold text-text-primary">{users.reduce((sum, user) => sum + user.booksRead, 0)}</p>
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
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-text-primary">{user.name}</div>
                          <div className="text-sm text-text-secondary">{user.phoneNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="h-4 w-4" />
                        <span>{user.city}, {user.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        <span>{user.joinDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary">{user.lastActive}</TableCell>
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
                                    <AvatarImage src={selectedUser.avatar} />
                                    <AvatarFallback className="bg-gradient-primary text-white text-lg">
                                      {selectedUser.name.charAt(0)}
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
                                    <p className="text-text-secondary">{selectedUser.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">الموقع:</span>
                                    <p className="text-text-secondary">{selectedUser.city}, {selectedUser.country}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">تاريخ التسجيل:</span>
                                    <p className="text-text-secondary">{selectedUser.joinDate}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">آخر نشاط:</span>
                                    <p className="text-text-secondary">{selectedUser.lastActive}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">الكتب المقروءة:</span>
                                    <p className="text-text-secondary">{selectedUser.booksRead} كتاب</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">وقت الاستماع:</span>
                                    <p className="text-text-secondary">{selectedUser.totalListeningTime}</p>
                                  </div>
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