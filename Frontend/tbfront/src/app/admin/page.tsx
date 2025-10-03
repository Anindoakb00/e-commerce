import React from "react";

const stats = [
  { label: "Total Orders", value: 1280, icon: "📦", color: "bg-blue-100 text-blue-800" },
  { label: "Total Users", value: 542, icon: "👤", color: "bg-green-100 text-green-800" },
  { label: "Total Products", value: 87, icon: "🛒", color: "bg-yellow-100 text-yellow-800" },
  { label: "Revenue", value: "$23,400", icon: "💰", color: "bg-purple-100 text-purple-800" },
];

export default function AdminPanel() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Panel</h1>

      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-lg shadow p-6 flex items-center gap-4 ${stat.color}`}>
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Product Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Product</button>
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2">ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">1</td>
                <td>MacBook Pro</td>
                <td>$1999</td>
                <td>12</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-yellow-400 rounded mr-2">Edit</button>
                  <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2">2</td>
                <td>iPhone 15</td>
                <td>$999</td>
                <td>30</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-yellow-400 rounded mr-2">Edit</button>
                  <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2">Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">#1001</td>
                <td>Anindo</td>
                <td><span className="px-2 py-1 bg-green-200 rounded">Delivered</span></td>
                <td>$2999</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">View</button>
                </td>
              </tr>
              <tr>
                <td className="py-2">#1002</td>
                <td>Fardin</td>
                <td><span className="px-2 py-1 bg-yellow-200 rounded">Pending</span></td>
                <td>$499</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">User Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2">User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">U001</td>
                <td>Anindo</td>
                <td>anindobiswas6790@example.com</td>
                <td>Customer</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-yellow-400 rounded mr-2">Edit</button>
                  <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2">U002</td>
                <td>Fardin</td>
                <td>fardin@example.com</td>
                <td>Admin</td>
                <td>
                  <button className="px-2 py-1 text-xs bg-yellow-400 rounded mr-2">Edit</button>
                  <button className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
