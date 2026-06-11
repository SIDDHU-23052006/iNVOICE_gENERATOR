import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/TopBar";
import { getProfile, saveProfile, getPreferences, savePreferences, Profile, Preferences } from "@/lib/storage";
import { getProfile as fetchProfile, saveProfile as pushProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { ImagePlus, Upload, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProfile();
        if (data) {
          setProfile(data as any);
          saveProfile(data as any);
        }
      } catch {
        const loadedProfile = getProfile();
        if (loadedProfile) setProfile(loadedProfile);
      }
    };
    loadData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const data = await pushProfile(profile as Profile);
      setProfile(data as any);
      saveProfile(data as any);
      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    }
  };

  const handleFileUpload = (field: "logo" | "signature" | "stamp", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProfile(prev => ({ ...prev, [field]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <TopBar showActions={false} />
      
      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/app/invoice">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your company profile.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
            <CardDescription>This information will appear on your invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "logo", label: "Company Logo" },
                { id: "signature", label: "Authorized Signature" },
                { id: "stamp", label: "Company Stamp" }
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label>{item.label}</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-muted/20 relative group hover:bg-muted/50 transition-colors">
                    {profile[item.id as keyof Profile] ? (
                      <div className="relative w-full h-24 flex items-center justify-center">
                        <img 
                          src={profile[item.id as keyof Profile] as string} 
                          alt={item.label} 
                          className="max-h-full max-w-full object-contain" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                          <span className="text-white text-xs font-medium flex items-center gap-1"><Upload className="w-3 h-3" /> Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center text-muted-foreground">
                        <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Upload Image</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(item.id as "logo" | "signature" | "stamp", e)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={profile.name || ""} onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email || ""} onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile.phone || ""} onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={profile.website || ""} onChange={e => setProfile(prev => ({ ...prev, website: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Textarea value={profile.address || ""} onChange={e => setProfile(prev => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={profile.city || ""} onChange={e => setProfile(prev => ({ ...prev, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={profile.state || ""} onChange={e => setProfile(prev => ({ ...prev, state: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={profile.country || ""} onChange={e => setProfile(prev => ({ ...prev, country: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={profile.postalCode || ""} onChange={e => setProfile(prev => ({ ...prev, postalCode: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input value={profile.gstin || ""} onChange={e => setProfile(prev => ({ ...prev, gstin: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>PAN / Tax ID</Label>
                <Input value={profile.pan || profile.taxId || ""} onChange={e => setProfile(prev => ({ ...prev, pan: e.target.value, taxId: e.target.value }))} />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveProfile} className="gradient-bg border-0 text-white shadow-md shadow-indigo-500/20">Save Profile</Button>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
