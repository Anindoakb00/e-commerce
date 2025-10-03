'use client'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 leading-relaxed">
        Your privacy is important to us. This policy explains how we collect, use, and
        protect your personal information.
      </p>

      <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
        <li>We only collect data necessary to process your orders.</li>
        <li>We never sell or share your personal information with third parties.</li>
        <li>We use secure methods to protect your payment information.</li>
      </ul>

      <p className="mt-4 text-gray-700">
        By using our platform, you agree to this privacy policy. Updates will be posted
        here when changes are made.
      </p>
    </div>
  )
}
