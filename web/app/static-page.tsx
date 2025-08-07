// This is a minimal page for successful static generation
export default function StaticHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Therapy Engage Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma avançada de terapia online com recursos de comunicação em tempo real
        </p>
        <div className="space-y-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Acessar Plataforma
          </a>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          <p>Carregando recursos interativos...</p>
        </div>
      </div>
    </div>
  )
}

// Force static generation for this page
export const dynamic = 'auto'
