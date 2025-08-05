'use client'

export function QuickActions() {
  const actions = [
    {
      title: 'New Session',
      description: 'Schedule a session with a client',
      icon: '📅',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => alert('New Session - Coming Soon!')
    },
    {
      title: 'Add Client',
      description: 'Register a new client',
      icon: '👤',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => alert('Add Client - Coming Soon!')
    },
    {
      title: 'Crisis Alert',
      description: 'Report an emergency situation',
      icon: '🚨',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => alert('Crisis Alert - Coming Soon!')
    },
    {
      title: 'Generate Report',
      description: 'Create client progress report',
      icon: '📊',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => alert('Generate Report - Coming Soon!')
    }
  ]

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg text-white transition-colors ${action.color} text-left`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm opacity-90 mt-1">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}