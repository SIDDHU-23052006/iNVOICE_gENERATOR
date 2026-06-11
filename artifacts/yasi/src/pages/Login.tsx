import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, Profile, saveProfile, getProfile } from "@/lib/storage";
import { signUp, signIn } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Login() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");

  const form = useForm<Profile>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      type: "organization",
      name: "",
      email: "",
      password: "",
      contactName: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postalCode: "",
      gstin: "",
      pan: "",
      taxId: "",
      website: "",
      industry: "",
    },
  });

  const onSubmitSignup = async (data: Profile) => {
    try {
      const response = await signUp(data);
      saveProfile(response as any);
      toast.success("Account created successfully!");
      setLocation("/app/invoice");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account. Please try again.");
    }
  };

  const onSubmitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await signIn({ email, password });
      saveProfile(response as any);
      toast.success("Signed in successfully!");
      setLocation("/app/invoice");
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password. Please try again.");
    }
  };

  const isOrganization = form.watch("type") === "organization";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] -z-10 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] rounded-full mix-blend-multiply opacity-70" />

      <div className="w-full max-w-lg relative z-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/logo.png" alt="YASI Logo" className="w-20 h-20 mb-4 object-contain" />
          <h1 className="text-3xl font-bold gradient-text tracking-tight">YASI</h1>
          <p className="text-muted-foreground mt-2">Finance Module</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="signup" className="text-base h-10">Sign Up</TabsTrigger>
            <TabsTrigger value="signin" className="text-base h-10">Sign In</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card className="border-border/50 shadow-xl shadow-indigo-500/5 bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Get started with SAP-grade invoicing</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitSignup)} className="space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-4"
                            >
                              <Label
                                htmlFor="organization"
                                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer ${field.value === "organization" ? "border-primary" : ""}`}
                              >
                                <RadioGroupItem value="organization" id="organization" className="sr-only" />
                                <Building2 className="mb-3 h-6 w-6" />
                                <span>Organization</span>
                              </Label>
                              <Label
                                htmlFor="individual"
                                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer ${field.value === "individual" ? "border-primary" : ""}`}
                              >
                                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                                <User className="mb-3 h-6 w-6" />
                                <span>Individual</span>
                              </Label>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{isOrganization ? "Company Name" : "Full Name"}</FormLabel>
                            <FormControl>
                              <Input placeholder={isOrganization ? "Acme Corp" : "John Doe"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isOrganization && (
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="billing@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="India" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Mumbai" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-12 gradient-bg text-white border-0 shadow-lg shadow-indigo-500/20">
                      Create Account
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signin">
            <Card className="border-border/50 shadow-xl shadow-indigo-500/5 bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitSignin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" name="email" type="email" placeholder="billing@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full h-12 gradient-bg text-white border-0 shadow-lg shadow-indigo-500/20 mt-4">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
