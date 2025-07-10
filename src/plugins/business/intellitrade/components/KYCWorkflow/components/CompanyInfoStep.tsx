import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield } from 'lucide-react'
import type { CompanyBasicInfo } from '../types/workflow.types'

interface CompanyInfoStepProps {
  companyInfo: CompanyBasicInfo
  setCompanyInfo: (info: CompanyBasicInfo) => void
}

export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({
  companyInfo,
  setCompanyInfo,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Company Information
        </CardTitle>
        <CardDescription>Provide basic company details for identity verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={companyInfo.companyName}
              onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
              placeholder="Don Hugo Exports LLC"
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={companyInfo.businessType}
              onValueChange={(value: any) =>
                setCompanyInfo({ ...companyInfo, businessType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exporter">Exporter</SelectItem>
                <SelectItem value="importer">Importer</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={companyInfo.registrationNumber}
              onChange={(e) =>
                setCompanyInfo({ ...companyInfo, registrationNumber: e.target.value })
              }
              placeholder="FL123456789"
            />
          </div>
          <div>
            <Label htmlFor="taxId">Tax ID *</Label>
            <Input
              id="taxId"
              value={companyInfo.taxId}
              onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
              placeholder="12-3456789"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="incorporationCountry">Incorporation Country *</Label>
          <Select
            value={companyInfo.incorporationCountry}
            onValueChange={(value) =>
              setCompanyInfo({ ...companyInfo, incorporationCountry: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CO">Colombia</SelectItem>
              <SelectItem value="MX">Mexico</SelectItem>
              <SelectItem value="BR">Brazil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Business Address</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={companyInfo.businessAddress.street}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, street: e.target.value },
                  })
                }
                placeholder="123 Export Street"
              />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={companyInfo.businessAddress.city}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, city: e.target.value },
                  })
                }
                placeholder="Miami"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={companyInfo.businessAddress.state}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    businessAddress: { ...companyInfo.businessAddress, state: e.target.value },
                  })
                }
                placeholder="FL"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Contact Person</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactName">Full Name *</Label>
              <Input
                id="contactName"
                value={companyInfo.contactPerson.name}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, name: e.target.value },
                  })
                }
                placeholder="Hugo Rodriguez"
              />
            </div>
            <div>
              <Label htmlFor="contactTitle">Title *</Label>
              <Input
                id="contactTitle"
                value={companyInfo.contactPerson.title}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, title: e.target.value },
                  })
                }
                placeholder="CEO"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={companyInfo.contactPerson.email}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, email: e.target.value },
                  })
                }
                placeholder="hugo@donhugoexports.com"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone *</Label>
              <Input
                id="contactPhone"
                value={companyInfo.contactPerson.phone}
                onChange={(e) =>
                  setCompanyInfo({
                    ...companyInfo,
                    contactPerson: { ...companyInfo.contactPerson, phone: e.target.value },
                  })
                }
                placeholder="+1 (305) 123-4567"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
