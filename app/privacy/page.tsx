import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-sm text-gray-500">
            <p>Your privacy is important to us. It is Resume Builder&apos;s policy to respect your privacy regarding any information we may collect from you across our website.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">1. Information We Collect</h2>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">2. Use of Information</h2>
            <p>We only use your personal information to provide you with Resume Builder services or to communicate with you about the website.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">3. Data Protection</h2>
            <p>We employ industry standard techniques to protect against unauthorized access of data about you that we store, including personal information.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">4. Cookies</h2>
            <p>We use cookies to store information about your preferences and to track your use of our website. This helps us to provide you with a good experience and to improve our service.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">5. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    </div>
  )
}