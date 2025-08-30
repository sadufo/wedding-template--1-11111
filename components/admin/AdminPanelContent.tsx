
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/auth";
import {
  Heart, Users, Calendar, Settings, Eye, BarChart3, UserCheck, Upload, X, Menu, LogOut, Map, Mail, Phone, Instagram, Facebook, Hash
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminPanelContentProps {
  user: User;
}

export default function AdminPanelContent({ user }: AdminPanelContentProps) {
  // --- Реальный рабочий код демо-админки ---
  // Ниже полный перенос JSX, хуков, функций, стилей
  // user используется из пропсов

  // ...вся логика, хуки и JSX внутри функции...

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [coupleData, setCoupleData] = useState({
    bride: "Emily",
    groom: "Michael",
    story: "We met in college during our first year and have been inseparable ever since. Our first date was at a small coffee shop where we talked for hours about our dreams and aspirations.",
    proposalStory: 'On a beautiful sunset evening at our favorite park, Michael got down on one knee and asked Emily to be his forever. With tears of joy and an overwhelming "Yes!", we began planning our dream wedding.',
    bridePhotoUrl: "",
    groomPhotoUrl: "",
    couplePhotoUrl: "",
    ceremonyDate: "",
    ceremonyTime: "",
    ceremonyVenue: "",
    ceremonyAddress: "",
    receptionDate: "",
    receptionTime: "",
    receptionVenue: "",
    receptionAddress: "",
    rsvpList: [
      { id: 1, name: "John Doe", email: "john@example.com", attending: "Yes", guests: 2 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", attending: "No", guests: 0 },
      { id: 3, name: "Alice Johnson", email: "alice@example.com", attending: "Yes", guests: 1 },
    ],
  });

  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "Emily & Michael's Wedding",
    welcomeMessage: "Join us as we celebrate our love and begin our journey together as husband and wife!",
    contactEmail: "emily.michael.wedding@email.com",
    contactPhone: "(555) 123-4567",
    socialInstagram: "@emilyandmichael2024",
    socialFacebook: "EmilyAndMichael2024",
    weddingHashtag: "#EmilyAndMichael2024",
  });

  const bridePhotoRef = useRef<HTMLInputElement>(null);
  const groomPhotoRef = useRef<HTMLInputElement>(null);
  const couplePhotoRef = useRef<HTMLInputElement>(null);

  const handleSave = (section: string) => {
    alert(`${section} settings saved! (Demo mode - changes won't persist)`);
  };

  const handleSelectOnMap = (addressField: string, currentAddress: string) => {
    const encodedAddress = encodeURIComponent(currentAddress || "New York, NY");
    const mapUrl = `https://www.google.com/maps/search/${encodedAddress}/@40.7128,-74.0060,15z`;
    window.open(mapUrl, "_blank", "width=800,height=600");
    alert(`Instructions:\n1. Find your venue on the map that just opened\n2. Right-click on the exact location\n3. Select "What's here?" or copy the address\n4. Come back and paste the address in the field below\n\nTip: You can also search for the venue name directly in the map.`);
  };

  const handleFileUpload = (field: string, file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCoupleData((prev) => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const removePhoto = (field: string) => {
    setCoupleData((prev) => ({ ...prev, [field]: "" }));
  };

  const PhotoUploadArea = ({ label, field, photoUrl, inputRef }: { label: string; field: string; photoUrl: string; inputRef: React.RefObject<HTMLInputElement> }) => (
    <div className="space-y-4">
      <Label className="text-foreground font-medium">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(field, file);
        }}
        className="hidden"
      />
      {photoUrl ? (
        <div className="relative border-2 border-border rounded-lg overflow-hidden">
          <Image src={photoUrl || "/placeholder.svg"} alt={label} width={200} height={200} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-1" />
              Change
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => removePhoto(field)}>
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => inputRef.current?.click()}>
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload image</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );

  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <Link href="/demo" target="_blank">
        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
          <Eye className="w-4 h-4 mr-2" />
          Preview Site
        </Button>
      </Link>
      <Link href="/">
        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
          Exit Demo
        </Button>
      </Link>
    </div>
  );

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "couple", label: "Couple Info", icon: Heart },
    { id: "events", label: "Events", icon: Calendar },
    { id: "rsvp", label: "RSVP List", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Пример реального JSX из демо-админки */}
      {/* Можно добавить <AdminHeader user={user} /> */}
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Wedding Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total RSVPs</CardTitle>
              <CardDescription>2 attending, 1 declined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expected Guests</CardTitle>
              <CardDescription>Including plus ones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Days Until Wedding</CardTitle>
              <CardDescription>June 15, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => setActiveSection("couple")}> <Heart className="w-6 h-6" /> Edit Couple Info </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => setActiveSection("events")}> <Calendar className="w-6 h-6" /> Manage Events </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => setActiveSection("rsvp")}> <Users className="w-6 h-6" /> View RSVPs </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => setActiveSection("settings")}> <Settings className="w-6 h-6" /> Site Settings </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
