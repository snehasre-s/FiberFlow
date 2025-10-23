import { useState, useEffect } from 'react';
import api from '../services/api';

const AssetInventory = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [assetStats, setAssetStats] = useState({
    fdh: { available: 0, assigned: 0, defective: 0, maintenance: 0 },
    ont: { available: 0, assigned: 0, defective: 0, maintenance: 0 },
    router: { available: 0, assigned: 0, defective: 0, maintenance: 0 },
    splitter: { available: 0, assigned: 0, defective: 0, maintenance: 0 },
    cable: { available: 0, assigned: 0, defective: 0, maintenance: 0 }
  });
  
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const [newAsset, setNewAsset] = useState({
    assetId: '',
    type: 'FDH',
    status: 'Available',
    location: ''
  });

  useEffect(() => {
    fetchAssets();
    fetchAssetStats();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setLoading(false);
    }
  };

  const fetchAssetStats = async () => {
    try {
      const response = await api.get('/assets/stats');
      setAssetStats(response.data);
    } catch (error) {
      console.error('Error fetching asset stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assets', newAsset);
      alert('Asset added successfully!');
      setShowAddModal(false);
      setNewAsset({ assetId: '', type: 'FDH', status: 'Available', location: '' });
      fetchAssets();
      fetchAssetStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add asset');
    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assets/${selectedAsset.id}`, selectedAsset);
      alert('Asset updated successfully!');
      setShowEditModal(false);
      setSelectedAsset(null);
      fetchAssets();
      fetchAssetStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update asset');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        alert('Asset deleted successfully!');
        fetchAssets();
        fetchAssetStats();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete asset');
      }
    }
  };

  const openEditModal = (asset) => {
    setSelectedAsset({ ...asset });
    setShowEditModal(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesType = !filters.type || asset.type === filters.type;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesSearch = !filters.search || 
      asset.assetId.toLowerCase().includes(filters.search.toLowerCase()) ||
      asset.location?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      Available: 'bg-success',
      Assigned: 'bg-primary',
      Defective: 'bg-danger',
      Maintenance: 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
  };

  const getAssetIcon = (type) => {
    const icons = {
      FDH: 'hdd-rack',
      ONT: 'router',
      Router: 'hdd-network',
      Splitter: 'diagram-3',
      Cable: 'bezier2'
    };
    return icons[type] || 'box';
  };

  const renderStatCard = (title, type, stats, icon, color) => (
    <div className="col-md-6 col-lg-4 col-xl mb-3">
      <div className={`card h-100 border-${color} border-start border-4`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="text-muted mb-1">{title}</h6>
              <h3 className="mb-0 fw-bold">
                {stats.available + stats.assigned + stats.defective + stats.maintenance}
              </h3>
            </div>
            <div className={`bg-${color} bg-opacity-10 p-2 rounded`}>
              <i className={`bi bi-${icon} text-${color} fs-4`}></i>
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-6">
              <small className="text-muted d-block">Available</small>
              <strong className="text-success">{stats.available}</strong>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Assigned</small>
              <strong className="text-primary">{stats.assigned}</strong>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Defective</small>
              <strong className="text-danger">{stats.defective}</strong>
            </div>
            <div className="col-6">
              <small className="text-muted d-block">Maintenance</small>
              <strong className="text-warning">{stats.maintenance}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-box-seam me-2 text-primary"></i>
            Asset Inventory
          </h2>
          <p className="text-muted">Manage all network assets and equipment</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Asset
          </button>
        </div>
      </div>

      {/* Asset Statistics Cards */}
      <div className="row mb-4">
        {renderStatCard('FDH Units', 'FDH', assetStats.fdh, 'hdd-rack', 'primary')}
        {renderStatCard('ONT Devices', 'ONT', assetStats.ont, 'router', 'success')}
        {renderStatCard('Routers', 'Router', assetStats.router, 'hdd-network', 'info')}
        {renderStatCard('Splitters', 'Splitter', assetStats.splitter, 'diagram-3', 'warning')}
        {renderStatCard('Cables', 'Cable', assetStats.cable, 'bezier2', 'secondary')}
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Asset Type</label>
              <select 
                className="form-select" 
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="FDH">FDH</option>
                <option value="ONT">ONT</option>
                <option value="Router">Router</option>
                <option value="Splitter">Splitter</option>
                <option value="Cable">Cable</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Status</label>
              <select 
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Defective">Defective</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Asset ID or Location..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Asset List ({filteredAssets.length} items)
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Last Maintenance</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td>
                        <strong>
                          <i className={`bi bi-${getAssetIcon(asset.type)} me-2 text-primary`}></i>
                          {asset.assetId}
                        </strong>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{asset.type}</span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>{asset.location || '-'}</td>
                      <td>
                        {asset.lastMaintenance 
                          ? new Date(asset.lastMaintenance).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="text-muted small">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => openEditModal(asset)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddAsset}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAsset.assetId}
                      onChange={(e) => setNewAsset({...newAsset, assetId: e.target.value})}
                      placeholder="e.g., FDH-001, ONT-2024-001"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset Type *</label>
                    <select
                      className="form-select"
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                      required
                    >
                      <option value="FDH">FDH</option>
                      <option value="ONT">ONT</option>
                      <option value="Router">Router</option>
                      <option value="Splitter">Splitter</option>
                      <option value="Cable">Cable</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status *</label>
                    <select
                      className="form-select"
                      value={newAsset.status}
                      onChange={(e) => setNewAsset({...newAsset, status: e.target.value})}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Defective">Defective</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAsset.location}
                      onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                      placeholder="e.g., Warehouse, Zone A"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Add Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && selectedAsset && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateAsset}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAsset.assetId}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset Type</label>
                    <select
                      className="form-select"
                      value={selectedAsset.type}
                      onChange={(e) => setSelectedAsset({...selectedAsset, type: e.target.value})}
                      required
                    >
                      <option value="FDH">FDH</option>
                      <option value="ONT">ONT</option>
                      <option value="Router">Router</option>
                      <option value="Splitter">Splitter</option>
                      <option value="Cable">Cable</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={selectedAsset.status}
                      onChange={(e) => setSelectedAsset({...selectedAsset, status: e.target.value})}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Defective">Defective</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAsset.location || ''}
                      onChange={(e) => setSelectedAsset({...selectedAsset, location: e.target.value})}
                      placeholder="e.g., Warehouse, Zone A"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Last Maintenance</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedAsset.lastMaintenance ? selectedAsset.lastMaintenance.split('T')[0] : ''}
                      onChange={(e) => setSelectedAsset({...selectedAsset, lastMaintenance: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Update Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetInventory;