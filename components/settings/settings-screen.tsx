"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Bell, Shield, CreditCard, LinkIcon, Trash2, Eye, EyeOff, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppLayout } from "@/components/layout/app-layout"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"

export default function SettingsScreen() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  })

  // Load user data from Clerk when available
  useEffect(() => {
    if (isLoaded && user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        bio: user.publicMetadata?.bio as string || "",
      })
    }
  }, [isLoaded, user])

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    messageNotifications: true,
    investmentAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showInvestmentHistory: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
  })

  const handleProfileSave = async () => {
    if (!user) return;
    
    setIsLoading(true)
    try {
      // Update user profile via Clerk
      await user.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      })


      // Note: Email changes require verification through Clerk's built-in flow
      
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error message
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      // Show success message
    }, 1000)
  }

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion
      router.push("/auth/login")
    }
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="connected" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Connected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {profileData.firstName.charAt(0) || "U"}
                        {profileData.lastName.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="border-primary/20 focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="border-primary/20 focus:border-primary/50 bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Email changes are managed through your Clerk account settings.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      className="border-primary/20 focus:border-primary/50 min-h-[100px]"
                    />
                  </div>



                  <div className="flex justify-end">
                    <Button
                      onClick={handleProfileSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project-updates">Project Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when projects you're interested in are updated
                        </p>
                      </div>
                      <Switch
                        id="project-updates"
                        checked={notificationSettings.projectUpdates}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, projectUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="message-notifications">Message Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                      </div>
                      <Switch
                        id="message-notifications"
                        checked={notificationSettings.messageNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, messageNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="investment-alerts">Investment Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get alerts about new investment opportunities</p>
                      </div>
                      <Switch
                        id="investment-alerts"
                        checked={notificationSettings.investmentAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, investmentAlerts: checked }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-digest">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">Receive a weekly summary of platform activity</p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, weeklyDigest: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and platform news
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="border-primary/20 focus:border-primary/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="border-primary/20 focus:border-primary/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="border-primary/20 focus:border-primary/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      isLoading ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your information and activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value) => setPrivacySettings((prev) => ({ ...prev, profileVisibility: value }))}
                    >
                      <SelectTrigger className="border-primary/20 focus:border-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                        <SelectItem value="members">
                          Members Only - Only platform members can see your profile
                        </SelectItem>
                        <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-investment-history">Show Investment History</Label>
                      <p className="text-sm text-muted-foreground">Display your past investments on your profile</p>
                    </div>
                    <Switch
                      id="show-investment-history"
                      checked={privacySettings.showInvestmentHistory}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({ ...prev, showInvestmentHistory: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-direct-messages">Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
                    </div>
                    <Switch
                      id="allow-direct-messages"
                      checked={privacySettings.allowDirectMessages}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({ ...prev, allowDirectMessages: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-online-status">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                    </div>
                    <Switch
                      id="show-online-status"
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked) =>
                        setPrivacySettings((prev) => ({ ...prev, showOnlineStatus: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="billing">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Access to advanced analytics and unlimited projects
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$29/month</div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Method</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded mr-3"></div>
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Billing History</h4>
                    <div className="space-y-2">
                      {[
                        { date: "Dec 1, 2023", amount: "$29.00", status: "Paid" },
                        { date: "Nov 1, 2023", amount: "$29.00", status: "Paid" },
                        { date: "Oct 1, 2023", amount: "$29.00", status: "Paid" },
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{invoice.date}</div>
                            <div className="text-sm text-muted-foreground">Pro Plan</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{invoice.amount}</div>
                            <Badge variant="outline" className="text-xs">
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">Change Plan</Button>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="connected">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected social accounts and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Google",
                      description: "Used for authentication and calendar integration",
                      connected: true,
                      icon: "🔍",
                    },
                    {
                      name: "LinkedIn",
                      description: "Import professional information and connections",
                      connected: true,
                      icon: "💼",
                    },
                    {
                      name: "Twitter",
                      description: "Share updates and connect with your network",
                      connected: false,
                      icon: "🐦",
                    },
                    {
                      name: "GitHub",
                      description: "Access technical projects and repositories",
                      connected: false,
                      icon: "🐙",
                    },
                  ].map((account) => (
                    <div key={account.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{account.icon}</div>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.connected && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            Connected
                          </Badge>
                        )}
                        <Button
                          variant={account.connected ? "outline" : "default"}
                          size="sm"
                          className={
                            account.connected ? "text-destructive border-destructive hover:bg-destructive/10" : ""
                          }
                        >
                          {account.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
