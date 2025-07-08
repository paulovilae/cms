'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Globe,
  Users,
  Bot,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  AlertCircle,
} from 'lucide-react'
import { getPageManagementData, togglePageActivation } from '@/utilities/pageRouting'
import { getBusinessMode, getEnabledFeatures } from '@/utilities/environment'
import { getCurrentBranding } from '@/utilities/branding'

interface PageManagementProps {
  onSave?: () => void
}

export function PageManagement({ onSave }: PageManagementProps) {
  const [managementData, setManagementData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changes, setChanges] = useState<Record<string, boolean>>({})

  const branding = getCurrentBranding()
  const businessMode = getBusinessMode()
  const enabledFeatures = getEnabledFeatures()

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    setLoading(true)
    try {
      const data = getPageManagementData()
      setManagementData(data)
    } catch (error) {
      console.error('Failed to load page management data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageToggle = (path: string, isActive: boolean) => {
    setChanges((prev) => ({
      ...prev,
      [path]: isActive,
    }))
  }

  const handleSaveChanges = async () => {
    setSaving(true)
    try {
      // Apply all changes
      for (const [path, isActive] of Object.entries(changes)) {
        togglePageActivation(path, isActive)
      }

      // Clear changes
      setChanges({})

      // Reload data
      await loadPageData()

      // Notify parent
      onSave?.()
    } catch (error) {
      console.error('Failed to save changes:', error)
    } finally {
      setSaving(false)
    }
  }

  const getBusinessIcon = (business: string) => {
    switch (business) {
      case 'intellitrade':
        return <Globe className="w-4 h-4" />
      case 'salarium':
        return <Users className="w-4 h-4" />
      case 'latinos':
        return <Bot className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getBusinessColor = (business: string) => {
    switch (business) {
      case 'intellitrade':
        return 'blue'
      case 'salarium':
        return 'violet'
      case 'latinos':
        return 'orange'
      default:
        return 'gray'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading page management...
      </div>
    )
  }

  if (!managementData) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <AlertCircle className="w-6 h-6 mr-2" />
        Failed to load page management data
      </div>
    )
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Page Management</h2>
          <p className="text-gray-600">
            Manage page visibility and features for {branding.displayName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getBusinessIcon(businessMode)}
            {businessMode.toUpperCase()}
          </Badge>
          {hasChanges && (
            <Button
              onClick={handleSaveChanges}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managementData.totalPages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{managementData.activePages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{managementData.businessMode}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledFeatures.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Page Management Tabs */}
      <Tabs defaultValue="marketing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketing">Marketing Pages</TabsTrigger>
          <TabsTrigger value="demo">Demo Pages</TabsTrigger>
          <TabsTrigger value="admin">Admin Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Pages</CardTitle>
              <CardDescription>Public-facing marketing and informational pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managementData.pages.marketing.map((page: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {page.path}
                        </Badge>
                        {page.requiresAuth && (
                          <Badge variant="secondary" className="text-xs">
                            Auth Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={
                          changes[page.path] !== undefined ? changes[page.path] : page.isActive
                        }
                        onCheckedChange={(checked: boolean) => handlePageToggle(page.path, checked)}
                      />
                      {(changes[page.path] !== undefined ? changes[page.path] : page.isActive) ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demo Pages</CardTitle>
              <CardDescription>Interactive demonstration and trial pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managementData.pages.demo.map((page: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {page.path}
                        </Badge>
                        {page.requiresAuth && (
                          <Badge variant="secondary" className="text-xs">
                            Auth Required
                          </Badge>
                        )}
                        {page.isDemo && (
                          <Badge variant="default" className="text-xs bg-purple-600">
                            Demo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={
                          changes[page.path] !== undefined ? changes[page.path] : page.isActive
                        }
                        onCheckedChange={(checked: boolean) => handlePageToggle(page.path, checked)}
                      />
                      {(changes[page.path] !== undefined ? changes[page.path] : page.isActive) ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Pages</CardTitle>
              <CardDescription>Administrative and management pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managementData.pages.admin.map((page: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {page.path}
                        </Badge>
                        <Badge variant="destructive" className="text-xs">
                          Admin Only
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={
                          changes[page.path] !== undefined ? changes[page.path] : page.isActive
                        }
                        onCheckedChange={(checked: boolean) => handlePageToggle(page.path, checked)}
                      />
                      {(changes[page.path] !== undefined ? changes[page.path] : page.isActive) ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enabled Features */}
      <Card>
        <CardHeader>
          <CardTitle>Enabled Features</CardTitle>
          <CardDescription>
            Currently active platform features for this business mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {enabledFeatures.length > 0 ? (
              enabledFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {feature}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500">No additional features enabled</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
