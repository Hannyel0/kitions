import React from 'react'
import Link from 'next/link'
import {
  UserIcon,
  BellIcon,
  Building2Icon,
  ShieldIcon,
  GlobeIcon,
  FileTextIcon,
  LayoutGridIcon,
  BeakerIcon,
  MailIcon,
  CodeIcon,
} from 'lucide-react'

interface SettingsSection {
  title: string
  items: {
    icon: React.ReactNode
    title: string
    description: string
    path?: string
    disabled?: boolean
  }[]
}

export function Settings() {
  const sections: SettingsSection[] = [
    {
      title: 'Personal settings',
      items: [
        {
          icon: <UserIcon className="h-5 w-5" />,
          title: 'Personal details',
          description:
            'Personal details, password, communication preferences, and your active sessions.',
          path: '/distributor/settings/personal',
        },
        {
          icon: <MailIcon className="h-5 w-5" />,
          title: 'Communication preferences',
          description:
            'Customize the emails, SMS, and push notifications you receive.',
          disabled: true,
        },
        {
          icon: <CodeIcon className="h-5 w-5" />,
          title: 'Developers',
          description: 'Workbench, developer tools, and more.',
          disabled: true,
        },
      ],
    },
    {
      title: 'Account settings',
      items: [
        {
          icon: <Building2Icon className="h-5 w-5" />,
          title: 'Business',
          description:
            'Account details, account health, public info, payouts, legal entity, custom domains, and more.',
          disabled: true,
        },
        {
          icon: <ShieldIcon className="h-5 w-5" />,
          title: 'Team and security',
          description:
            'Team members, roles, account security, authorized apps, and shared resources.',
          disabled: true,
        },
        {
          icon: <GlobeIcon className="h-5 w-5" />,
          title: 'Company profile',
          description: 'Manage how you show up on the business network.',
          disabled: true,
        },
        {
          icon: <LayoutGridIcon className="h-5 w-5" />,
          title: 'Your plans',
          description: 'Manage how you pay for services.',
          disabled: true,
        },
        {
          icon: <FileTextIcon className="h-5 w-5" />,
          title: 'Compliance and documents',
          description: 'PCI compliance, documents, and legacy exports.',
          disabled: true,
        },
        {
          icon: <BeakerIcon className="h-5 w-5" />,
          title: 'Product previews',
          description: 'Try out new features.',
          disabled: true,
        },
      ],
    },
  ]
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className={`relative group rounded-lg border border-gray-200 bg-white p-6 hover:shadow-sm transition-all duration-200 ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {!item.disabled && item.path ? (
                    <Link href={item.path} className="absolute inset-0" />
                  ) : null}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-blue-600">{item.icon}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                        {item.disabled && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Coming soon
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
