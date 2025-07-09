import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Linkedin, Twitter, Github, Globe } from 'lucide-react'
import type { TeamMember } from '@/payload-types'

interface TeamMemberCardProps {
  member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  // Helper function to get social link icon
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'github':
        return <Github className="w-5 h-5" />
      case 'website':
        return <Globe className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  // Helper function to get social link color
  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return 'hover:text-blue-600'
      case 'twitter':
        return 'hover:text-blue-400'
      case 'github':
        return 'hover:text-gray-900'
      case 'website':
        return 'hover:text-green-600'
      default:
        return 'hover:text-gray-600'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        {member.photo && typeof member.photo === 'object' && (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src={member.photo.url || ''}
              alt={member.photo.alt || member.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold text-component-text">{member.name}</h3>
        <p className="text-component-text-muted">{member.position}</p>
        {member.department && (
          <Badge variant="secondary" className="mt-2 capitalize">
            {member.department}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {/* Bio - Note: bio is a rich text field, so we'd need to render it properly */}
        {member.bio && (
          <div className="text-component-text-muted text-sm mb-4 text-center">
            {/* For now, we'll just show a placeholder since bio is rich text */}
            <p>Team member biography</p>
          </div>
        )}

        {/* Social Links */}
        {member.socialLinks && member.socialLinks.length > 0 && (
          <div className="flex justify-center space-x-4">
            {member.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-component-text-muted transition-colors ${getSocialColor(link.platform)}`}
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
