'use client'

import React, { useState, useEffect } from 'react'
import AutoAuthWrapper from '@/components/auth/AutoAuthWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  Clock,
  FileText,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Calendar,
  User,
} from 'lucide-react'
import Link from 'next/link'

interface FlowInstance {
  id: string
  title: string
  template: {
    id: string
    name: string
    category: string
  }
  status: 'draft' | 'in-progress' | 'completed' | 'archived' | 'paused'
  currentStep: number
  totalSteps: number
  progress: number
  updatedAt: string
  createdAt: string
  metadata?: {
    startedAt?: string
    completedAt?: string
    totalTime?: number
  }
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: FileText },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  archived: { label: 'Archived', color: 'bg-yellow-100 text-yellow-800', icon: FileText },
  paused: { label: 'Paused', color: 'bg-orange-100 text-orange-800', icon: Clock },
}

function FlowInstancesPageContent() {
  const [instances, setInstances] = useState<FlowInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const fetchInstances = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/salarium/flow-instances?limit=50')

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view your flow instances.')
          return
        }
        throw new Error(`Failed to fetch instances: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setInstances(result.instances)
      } else {
        setError(result.error || 'Failed to load instances')
      }
    } catch (error) {
      console.error('Error fetching flow instances:', error)
      setError(error instanceof Error ? error.message : 'Failed to load instances')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteInstance = async (instanceId: string) => {
    if (
      !confirm('Are you sure you want to delete this flow instance? This action cannot be undone.')
    ) {
      return
    }

    try {
      const response = await fetch(`/api/salarium/flow-instances/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setInstances((prev) => prev.filter((instance) => instance.id !== instanceId))
        // Show success message
        console.log('Flow instance deleted successfully')
      } else {
        // Try to get error details from response
        let errorMessage = 'Failed to delete instance'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }

        console.error('Delete failed:', response.status, errorMessage)
        alert(`Failed to delete instance: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error deleting instance:', error)
      alert('Failed to delete instance: Network error')
    }
  }

  useEffect(() => {
    fetchInstances()
  }, [])

  const filteredInstances = instances.filter((instance) => {
    if (filter === 'all') return true
    return instance.status === filter
  })

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || FileText
    return <Icon className="w-4 h-4" />
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading your flow instances...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Instances</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchInstances} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Flow Instances</h1>
            <p className="text-gray-600">Manage your saved workflow progress</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchInstances} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/salarium/job-flow">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Job Description
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {['all', 'draft', 'in-progress', 'completed', 'paused'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status === 'all'
                ? 'All'
                : statusConfig[status as keyof typeof statusConfig]?.label || status}
              <Badge variant="secondary" className="ml-2">
                {status === 'all'
                  ? instances.length
                  : instances.filter((i) => i.status === status).length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Instances Grid */}
      {filteredInstances.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'all' ? 'No flow instances found' : `No ${filter} instances`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? 'Start creating job descriptions to see your workflow instances here.'
              : `You don't have any ${filter} instances yet.`}
          </p>
          <Link href="/salarium/job-flow">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Job Description
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInstances.map((instance) => (
            <Card key={instance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate" title={instance.title}>
                      {instance.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{instance.template.name}</CardDescription>
                  </div>
                  {getStatusBadge(instance.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{instance.progress}%</span>
                  </div>
                  <Progress value={instance.progress} className="w-full" />
                  <div className="text-xs text-gray-500">
                    Step {instance.currentStep} of {instance.totalSteps}
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(instance.updatedAt)}</span>
                  </div>
                  {instance.metadata?.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Completed {formatDate(instance.metadata.completedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/salarium/job-flow?instance=${instance.id}`} className="flex-1">
                    <Button className="w-full flex items-center gap-2" size="sm">
                      <Edit className="w-4 h-4" />
                      {instance.status === 'completed' ? 'View' : 'Continue'}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteInstance(instance.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Wrap the component with enhanced authentication
export default function FlowInstancesPage() {
  return (
    <AutoAuthWrapper
      requireAuth={true}
      fallbackMessage="Please log in to view and manage your saved flow instances."
      enableAutoAuth={true}
    >
      <FlowInstancesPageContent />
    </AutoAuthWrapper>
  )
}
