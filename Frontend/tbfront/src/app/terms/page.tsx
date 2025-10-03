'use client'

export default function TermsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-gray-700 leading-relaxed">
        By using our platform, you agree to the following terms and conditions.
      </p>

      <ol className="list-decimal pl-6 mt-4 space-y-2 text-gray-700">
        <li>All purchases are subject to availability.</li>
        <li>Prices may change without prior notice.</li>
        <li>
          Users must provide accurate information when creating an account or placing
          an order.
        </li>
        <li>
          We reserve the right to suspend accounts that violate our policies.
        </li>
      </ol>

      <p className="mt-4 text-gray-700">
        Please read these terms carefully. If you do not agree, do not use our services.
      </p>
    </div>
  )
}
