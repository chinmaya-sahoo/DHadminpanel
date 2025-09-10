import React, { useState } from 'react';

const UserManagement = () => {
  // State for active page
  const [activePage, setActivePage] = useState('accounts');
  
  // Sample data for accounts
  const [accounts] = useState([
    { id: 1, name: 'Personal', transactions: 15, balance: 45250.00 },
    { id: 2, name: 'Business', transactions: 12, balance: 125000.00 },
    { id: 3, name: 'Freelance', transactions: 8, balance: 28500.00 }
  ]);

  // Sample data for team members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Admin', permissions: ['view', 'add', 'edit', 'delete'] },
    { id: 2, name: 'Bob Smith', role: 'Editor', permissions: ['view', 'add', 'edit'] },
    { id: 3, name: 'Carol Lee', role: 'Viewer', permissions: ['view'] }
  ]);

  // State for adding new team member
  const [newMember, setNewMember] = useState({ name: '', role: 'Viewer', permissions: [] });
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle permission toggle
  const togglePermission = (permission) => {
    if (newMember.permissions.includes(permission)) {
      setNewMember({
        ...newMember,
        permissions: newMember.permissions.filter(p => p !== permission)
      });
    } else {
      setNewMember({
        ...newMember,
        permissions: [...newMember.permissions, permission]
      });
    }
  };

  // Add new team member
  const addTeamMember = () => {
    if (newMember.name.trim() === '') return;
    
    const member = {
      id: teamMembers.length + 1,
      name: newMember.name,
      role: newMember.role,
      permissions: newMember.permissions
    };
    
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', role: 'Viewer', permissions: [] });
    setShowAddForm(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Accounts Page Component
  const AccountsPage = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Your Accounts</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {accounts.length} Accounts
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-800">{account.name}</h3>
                <p className="text-sm text-gray-500">{account.transactions} transactions</p>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(account.balance)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Team Management Page Component
  const TeamManagementPage = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Manage Access</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {teamMembers.length} Team Members
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Team Members</h3>
        
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div key={member.id} className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {member.permissions.map(permission => (
                  <span 
                    key={permission} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* <div className="border-t pt-6">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center text-blue-600 font-medium hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Team Member
        </button>
        
        {showAddForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team member name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {['view', 'add', 'edit', 'delete'].map(permission => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`permission-${permission}`}
                      checked={newMember.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`permission-${permission}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={addTeamMember}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Member
              </button>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management Dashboard</h1>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${activePage === 'accounts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActivePage('accounts')}
          >
            Accounts
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activePage === 'team' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActivePage('team')}
          >
            Team Management
          </button>
        </div>
        
        {/* Page Content */}
        {activePage === 'accounts' ? <AccountsPage /> : <TeamManagementPage />}
      </div>
    </div>
  );
};

export default UserManagement;