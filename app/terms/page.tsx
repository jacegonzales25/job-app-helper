import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose prose-sm text-gray-500">
            <p>Welcome to Resume Builder. By using our service, you agree to these terms. Please read them carefully.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">1. Use of Service</h2>
            <p>Resume Builder provides a platform for creating and managing resumes. You may use our service for personal, non-commercial use only.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">2. User Accounts</h2>
            <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">3. Termination</h2>
            <p>We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">4. Limitations</h2>
            <p>In no event shall Resume Builder be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
            
            <h2 className="text-xl font-semibold mt-4 mb-2">5. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
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