import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, ShieldAlert, Search, Filter, 
  Trash2, Eye, Ban, CheckCircle, RefreshCw, Activity,
  Clock, MapPin, Phone, Mail, Shield, AlertTriangle
} from 'lucide-react';
import Button from '../../../../components/Button/Button';
import Modal from '../../../../components/Modal/Modal';
import { userManagementService } from '../../../../services/userManagementService';
import { masterMenuService } from '../../../../services/masterMenuService';
import './UserManagementTab.css';

export default function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('USERS'); // 'USERS' or 'ACTIVITIES'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL', 'RESTAURANT', 'NGO', 'VOLUNTEER', 'CONSUMER', 'ADMIN'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'DISABLED'

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadUserData = async () => {
    // Attempt backend sync first
    const backendData = await userManagementService.fetchUsersFromBackend();
    if (backendData && backendData.length > 0) {
      setUsers(backendData);
    } else {
      const localData = userManagementService.getUsers();
      setUsers(localData);
    }
  };

  useEffect(() => {
    loadUserData();
    const handleUpdate = () => {
      const data = userManagementService.getUsers();
      setUsers(data);
    };
    window.addEventListener('foodrescue_users_updated', handleUpdate);
    return () => window.removeEventListener('foodrescue_users_updated', handleUpdate);
  }, []);

  const handleToggleStatus = async (userId, currentStatus, name) => {
    const updated = await userManagementService.toggleUserStatus(userId);
    setUsers(updated);
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED ⛔' : 'ACTIVE ✅';
    setFeedbackMsg(`Account for "${name}" updated to status: ${newStatus} (Saved to Database)`);

    // If modal open for this user, refresh selected user state
    if (selectedUser && String(selectedUser.id) === String(userId)) {
      const refreshedUser = updated.find(u => String(u.id) === String(userId));
      setSelectedUser(refreshedUser);
    }

    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const updated = await userManagementService.deleteUserPermanently(userToDelete.id);
    setUsers(updated);
    setFeedbackMsg(`❌ Account for "${userToDelete.name}" (${userToDelete.email}) permanently removed from Database!`);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);

    if (selectedUser && String(selectedUser.id) === String(userToDelete.id)) {
      setIsDetailModalOpen(false);
      setSelectedUser(null);
    }

    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (user.phone && user.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const disabledCount = users.filter(u => u.status === 'DISABLED').length;

  const roleCounts = {
    RESTAURANT: users.filter(u => u.role === 'RESTAURANT').length,
    NGO: users.filter(u => u.role === 'NGO').length,
    VOLUNTEER: users.filter(u => u.role === 'VOLUNTEER').length,
    CONSUMER: users.filter(u => u.role === 'CONSUMER').length,
    ADMIN: users.filter(u => u.role === 'ADMIN').length
  };

  const globalActivities = userManagementService.getGlobalActivities();

  return (
    <div className="tab-pane-user-management">
      {/* STATS HEADER CARDS */}
      <div className="um-stats-grid">
        <div className="um-stat-card">
          <div className="um-stat-icon blue"><Users size={22} /></div>
          <div>
            <span className="um-stat-label">Total System Users</span>
            <strong className="um-stat-val">{users.length}</strong>
          </div>
        </div>

        <div className="um-stat-card">
          <div className="um-stat-icon green"><UserCheck size={22} /></div>
          <div>
            <span className="um-stat-label">Active Users</span>
            <strong className="um-stat-val">{activeCount}</strong>
          </div>
        </div>

        <div className="um-stat-card">
          <div className="um-stat-icon red"><UserX size={22} /></div>
          <div>
            <span className="um-stat-label">Suspended / Disabled</span>
            <strong className="um-stat-val">{disabledCount}</strong>
          </div>
        </div>

        <div className="um-stat-card">
          <div className="um-stat-icon purple"><ShieldAlert size={22} /></div>
          <div>
            <span className="um-stat-label">Super Admins</span>
            <strong className="um-stat-val">{roleCounts.ADMIN}</strong>
          </div>
        </div>
      </div>

      {/* FEEDBACK NOTICE TOAST */}
      {feedbackMsg && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '8px',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.3)',
          color: '#2563eb',
          fontWeight: '600',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Activity size={18} />
          {feedbackMsg}
        </div>
      )}

      {/* VIEW SWITCHER & TITLE */}
      <div className="um-view-switcher-bar">
        <div className="um-tabs-group">
          <button 
            className={`um-tab-toggle ${viewMode === 'USERS' ? 'active' : ''}`}
            onClick={() => setViewMode('USERS')}
          >
            <Users size={18} />
            <span>Active Users Directory ({users.length})</span>
          </button>
          <button 
            className={`um-tab-toggle ${viewMode === 'ACTIVITIES' ? 'active' : ''}`}
            onClick={() => setViewMode('ACTIVITIES')}
          >
            <Activity size={18} />
            <span>Live Audit Feed ({globalActivities.length})</span>
          </button>
        </div>

        <button className="btn-um-action view-details" onClick={loadUserData} title="Refresh User List">
          <RefreshCw size={14} /> Refresh Directory
        </button>
      </div>

      {/* VIEW 1: ACTIVE & REGISTERED USERS DIRECTORY */}
      {viewMode === 'USERS' && (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="um-controls-bar">
            <div className="um-search-box">
              <Search size={16} style={{ color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="Search user by name, email, phone, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ROLE FILTER PILLS */}
            <div className="um-filter-pills">
              <button 
                className={`um-pill-btn ${roleFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setRoleFilter('ALL')}
              >
                All Roles ({users.length})
              </button>
              <button 
                className={`um-pill-btn ${roleFilter === 'RESTAURANT' ? 'active' : ''}`}
                onClick={() => setRoleFilter('RESTAURANT')}
              >
                🏪 Restaurant ({roleCounts.RESTAURANT})
              </button>
              <button 
                className={`um-pill-btn ${roleFilter === 'NGO' ? 'active' : ''}`}
                onClick={() => setRoleFilter('NGO')}
              >
                🏠 NGO ({roleCounts.NGO})
              </button>
              <button 
                className={`um-pill-btn ${roleFilter === 'VOLUNTEER' ? 'active' : ''}`}
                onClick={() => setRoleFilter('VOLUNTEER')}
              >
                🛵 Rider/Volunteer ({roleCounts.VOLUNTEER})
              </button>
              <button 
                className={`um-pill-btn ${roleFilter === 'CONSUMER' ? 'active' : ''}`}
                onClick={() => setRoleFilter('CONSUMER')}
              >
                👨‍💼 Consumer ({roleCounts.CONSUMER})
              </button>
              <button 
                className={`um-pill-btn ${roleFilter === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setRoleFilter('ADMIN')}
              >
                🛡️ Admin ({roleCounts.ADMIN})
              </button>
            </div>

            {/* STATUS FILTER PILLS */}
            <div className="um-filter-pills" style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '12px' }}>
              <button 
                className={`um-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                Status: All
              </button>
              <button 
                className={`um-pill-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ACTIVE')}
              >
                🟢 Active Only
              </button>
              <button 
                className={`um-pill-btn ${statusFilter === 'DISABLED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('DISABLED')}
              >
                🔴 Disabled Only
              </button>
            </div>
          </div>

          {/* USERS DATA TABLE */}
          <div className="um-table-card">
            <div className="um-table-wrapper">
              <table className="um-users-table">
                <thead>
                  <tr>
                    <th>User Identity</th>
                    <th>Assigned Role</th>
                    <th>Account Status</th>
                    <th>Contact & Location</th>
                    <th>Joined Date & Last Activity</th>
                    <th style={{ textAlign: 'right' }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        🔍 No active or registered users found matching your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className={u.status === 'DISABLED' ? 'row-disabled' : ''}>
                        {/* USER IDENTITY */}
                        <td>
                          <div className="user-cell-meta">
                            <div className="user-avatar-circle">{u.avatar || '👤'}</div>
                            <div>
                              <div className="user-name-text">
                                {u.name}
                                {u.role === 'ADMIN' && <Shield size={14} style={{ color: '#dc2626' }} title="Super Admin Account" />}
                              </div>
                              <div className="user-email-text">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* ASSIGNED ROLE */}
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === 'RESTAURANT' && '🏪 '}
                            {u.role === 'NGO' && '🏠 '}
                            {u.role === 'VOLUNTEER' && '🛵 '}
                            {u.role === 'CONSUMER' && '👨‍💼 '}
                            {u.role === 'ADMIN' && '🛡️ '}
                            {u.role}
                          </span>
                        </td>

                        {/* ACCOUNT STATUS */}
                        <td>
                          <span className={`status-badge ${u.status}`}>
                            <span className="status-dot-pulse"></span>
                            {u.status === 'ACTIVE' ? 'Active User' : 'Suspended / Disabled'}
                          </span>
                        </td>

                        {/* CONTACT & LOCATION */}
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            <div>📞 {u.phone || 'N/A'}</div>
                            <div style={{ color: '#64748b', fontSize: '0.78rem' }}>📍 {u.location || 'Dhaka'}</div>
                          </div>
                        </td>

                        {/* JOINED & LAST ACTIVE */}
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            <div>📅 {new Date(u.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div style={{ color: '#059669', fontSize: '0.78rem', fontWeight: '600' }}>⚡ {u.lastActive || 'Recently'}</div>
                          </div>
                        </td>

                        {/* ADMIN ACTIONS */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="um-action-buttons" style={{ justifyContent: 'flex-end' }}>
                            {/* VIEW DETAILS */}
                            <button 
                              className="btn-um-action view-details"
                              onClick={() => handleOpenDetails(u)}
                              title="Inspect Full Profile & Activity Log"
                            >
                              <Eye size={14} /> Details
                            </button>

                            {/* TOGGLE DISABLE / ENABLE */}
                            {u.role !== 'ADMIN' ? (
                              <button 
                                className={`btn-um-action ${u.status === 'ACTIVE' ? 'toggle-disable' : 'toggle-enable'}`}
                                onClick={() => handleToggleStatus(u.id, u.status, u.name)}
                                title={u.status === 'ACTIVE' ? 'Suspend / Disable User Account' : 'Reactivate User Account'}
                              >
                                {u.status === 'ACTIVE' ? (
                                  <>
                                    <Ban size={14} /> Disable
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={14} /> Enable
                                  </>
                                )}
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>Protected</span>
                            )}

                            {/* PERMANENT REMOVE */}
                            {u.role !== 'ADMIN' && (
                              <button 
                                className="btn-um-action delete-user"
                                onClick={() => handleOpenDeleteModal(u)}
                                title="Permanently Delete Account from System"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: LIVE AUDIT & ACTIVITY FEED */}
      {viewMode === 'ACTIVITIES' && (
        <div className="um-activity-timeline-card">
          <div className="activity-feed-header">
            <h4><Activity size={20} style={{ color: '#2563eb' }} /> Ecosystem Real-Time Activity Feed</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing all user updates, postings, logins & admin controls</span>
          </div>

          <div className="activity-timeline-list">
            {globalActivities.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No activities logged yet.</p>
            ) : (
              globalActivities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content-box">
                    <div className="activity-user-row">
                      <span>{act.userAvatar}</span>
                      <strong>{act.userName}</strong>
                      <span className={`role-badge ${act.userRole}`}>{act.userRole}</span>
                      <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: 'auto' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="activity-text">{act.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: VIEW USER DETAILS & ACTIVITY HISTORY */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`👤 User Profile: ${selectedUser?.name || 'Details'}`}
      >
        {selectedUser && (
          <div className="user-detail-modal-body">
            <div className="user-modal-header-profile">
              <div className="user-modal-avatar">{selectedUser.avatar || '👤'}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedUser.name}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>{selectedUser.email}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span>
                  <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
                </div>
              </div>
            </div>

            {/* RESTAURANT MASTER MENU CATALOG INSPECTION FOR SUPER ADMIN */}
            {selectedUser.role === 'RESTAURANT' && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '14px',
                margin: '14px 0'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📖 Restaurant Configured Master Menu Catalog ({masterMenuService.getMasterMenuItems().length} Items)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {masterMenuService.getMasterMenuItems().map(item => (
                    <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', fontSize: '0.8rem' }}>
                      <img src={item.demoImage} alt={item.title} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }} />
                      <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.82rem' }}>{item.title}</strong>
                      <span style={{ color: '#475569' }}>Base: ৳{item.originalPrice}</span> | <span style={{ color: '#2563eb' }}>Tier 2: {item.tier2Discount}% off</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="user-modal-grid">
              <div className="user-modal-item">
                <label>User ID</label>
                <p>{selectedUser.id}</p>
              </div>
              <div className="user-modal-item">
                <label>Phone Number</label>
                <p>{selectedUser.phone || 'Not Provided'}</p>
              </div>
              <div className="user-modal-item">
                <label>Registered Address</label>
                <p>{selectedUser.location || 'Dhaka, Bangladesh'}</p>
              </div>
              <div className="user-modal-item">
                <label>Registration Date</label>
                <p>{new Date(selectedUser.registeredAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* USER ACTIVITY TIMELINE */}
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> User Activity Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {selectedUser.activityLog && selectedUser.activityLog.length > 0 ? (
                  selectedUser.activityLog.map((log) => (
                    <div key={log.id} style={{
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{log.text}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No logged activities for this user.</p>
                )}
              </div>
            </div>

            {/* DANGER ZONE FOR NON-ADMIN USERS */}
            {selectedUser.role !== 'ADMIN' && (
              <div className="danger-zone-box">
                <div className="danger-zone-title">
                  <AlertTriangle size={16} /> Admin Account Control Actions
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0' }}>
                  Changes take effect immediately across all application instances.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    variant={selectedUser.status === 'ACTIVE' ? 'secondary' : 'primary'}
                    onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status, selectedUser.name)}
                  >
                    {selectedUser.status === 'ACTIVE' ? 'Disable Account ⛔' : 'Activate Account ✅'}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenDeleteModal(selectedUser);
                    }}
                  >
                    Permanently Delete User 🗑️
                  </Button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Close Window
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRMATION MODAL: PERMANENTLY REMOVE ACCOUNT */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="⚠️ Confirm Permanent Account Deletion"
      >
        {userToDelete && (
          <div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#0f172a' }}>
                  Are you sure you want to permanently remove this user?
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                  User: <strong>{userToDelete.name}</strong> (<code>{userToDelete.email}</code>)<br />
                  Role: <strong style={{ textTransform: 'uppercase' }}>{userToDelete.role}</strong>
                </p>
              </div>
            </div>

            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.85rem',
              color: '#9f1239',
              marginBottom: '20px'
            }}>
              🚨 <strong>Warning:</strong> This action cannot be undone. All credentials, saved tokens, and user profile data will be erased from the system permanently.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Yes, Delete Account Permanently 🗑️
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
