import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssetInventory = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [assetStats, setAssetStats] = useState({});
  
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const [newAsset, setNewAsset] = useState({
    assetType: 'ONT',
    model: '',
    serialNumber: '',
    status: 'Available',
    location: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleAddAssetChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateAssetForm = (asset) => {
    const newErrors = {};
    
    if (!asset.model?.trim()) newErrors.model = 'Model is required';
    if (!asset.serialNumber?.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!asset.location?.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    
    if (!validateAssetForm(newAsset)) return;
    
    try {
      await api.post('/assets', newAsset);
      alert('Asset added successfully!');
      setShowAddModal(false);
      setNewAsset({
        assetType: 'ONT',
        model: '',
        serialNumber: '',
        status: 'Available',
        location: ''
      });
      fetchAssets();
      fetchAssetStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add asset');
    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    
    if (!validateAssetForm(selectedAsset)) return;
    
    try {
      await api.put(`/assets/${selectedAsset.assetId}`, selectedAsset);
      alert('Asset updated successfully!');
      setShowEditModal(false);
      setSelectedAsset(null);
      fetchAssets();
      fetchAssetStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update asset');
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${assetId}`);
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
    const matchesType = !filters.type || asset.assetType === filters.type;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesSearch = !filters.search || 
      asset.serialNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
      asset.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
      asset.location?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'Available': 'success',
      'Assigned': 'primary',
      'Faulty': 'danger',
      'Retired': 'secondary'
    };
    return badges[status] || 'secondary';
  };

  const getAssetIcon = (type) => {
    const icons = {
      'ONT': 'router',
      'Router': 'hdd-network',
      'FDH': 'hdd-rack',
      'Splitter': 'diagram-3',
      'Switch': 'diagram-2',
      'CPE': 'router-fill',
      'FiberRoll': 'bezier2'
    };
    return icons[type] || 'box';
  };

  const renderStatCard = (type, count, icon, color) => (
    <div className="col-md-6 col-lg-4 col-xl mb-3">
      <div className="card h-100 border-0" style={{ background: `${color}10` }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="text-muted mb-1 small">{type}</p>
              <h3 className="fw-bold mb-0">{count}</h3>
            </div>
            <div className="rounded-circle d-flex align-items-center justify-content-center"
                 style={{ 
                   width: '45px', 
                   height: '45px', 
                   background: `${color}20`
                 }}>
              <i className={`bi bi-${icon} fs-5`} style={{ color }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-box-seam-fill me-2 text-success"></i>
            Asset Inventory
          </h2>
          <p className="text-muted mb-0">Manage all network assets and equipment</p>
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

      {/* Asset Statistics */}
      <div className="row mb-4">
        {renderStatCard('ONT Devices', assetStats.ont || 0, 'router', '#667eea')}
        {renderStatCard('Routers', assetStats.router || 0, 'hdd-network', '#10b981')}
        {renderStatCard('FDH Units', assetStats.fdh || 0, 'hdd-rack', '#f59e0b')}
        {renderStatCard('Splitters', assetStats.splitter || 0, 'diagram-3', '#3b82f6')}
        {renderStatCard('Switches', assetStats.switch || 0, 'diagram-2', '#8b5cf6')}
        {renderStatCard('CPE', assetStats.cpe || 0, 'router-fill', '#ec4899')}
        {renderStatCard('Fiber Rolls', assetStats.fiberRoll || 0, 'bezier2', '#6366f1')}
      </div>

      {/* Filters */}
      <div className="card mb-4 border-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Asset Type</label>
              <select 
                className="form-select" 
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="ONT">ONT</option>
                <option value="Router">Router</option>
                <option value="FDH">FDH</option>
                <option value="Splitter">Splitter</option>
                <option value="Switch">Switch</option>
                <option value="CPE">CPE</option>
                <option value="FiberRoll">Fiber Roll</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Status</label>
              <select 
                className="form-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Faulty">Faulty</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by serial number, model, or location..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-table me-2 text-primary"></i>
            Asset List ({filteredAssets.length} items)
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 ps-4">Type</th>
                  <th className="border-0">Serial Number</th>
                  <th className="border-0">Model</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Location</th>
                  <th className="border-0">Assigned To</th>
                  <th className="border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.assetId}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <i className={`bi bi-${getAssetIcon(asset.assetType)} me-2 text-primary fs-5`}></i>
                          <span className="fw-semibold">{asset.assetType}</span>
                        </div>
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded">{asset.serialNumber}</code>
                      </td>
                      <td>{asset.model}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-geo-alt me-1 text-muted"></i>
                        {asset.location}
                      </td>
                      <td>
                        {asset.assignedToCustomerId ? (
                          <span className="text-primary">
                            <i className="bi bi-person-check me-1"></i>
                            Customer #{asset.assignedToCustomerId}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
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
                          onClick={() => handleDeleteAsset(asset.assetId)}
                          disabled={asset.status === 'Assigned'}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-5">
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
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-plus-circle-fill me-2 text-primary"></i>
                  Add New Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddAsset}>
                <div className="modal-body px-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Asset Type</label>
                    <select
                      className="form-select"
                      name="assetType"
                      value={newAsset.assetType}
                      onChange={handleAddAssetChange}
                    >
                      <option value="ONT">ONT</option>
                      <option value="Router">Router</option>
                      <option value="FDH">FDH</option>
                      <option value="Splitter">Splitter</option>
                      <option value="Switch">Switch</option>
                      <option value="CPE">CPE</option>
                      <option value="FiberRoll">Fiber Roll</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Model *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                      name="model"
                      value={newAsset.model}
                      onChange={handleAddAssetChange}
                      placeholder="e.g., ZTE F670L"
                    />
                    {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Serial Number *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.serialNumber ? 'is-invalid' : ''}`}
                      name="serialNumber"
                      value={newAsset.serialNumber}
                      onChange={handleAddAssetChange}
                      placeholder="e.g., ONT-2024-001"
                    />
                    {errors.serialNumber && <div className="invalid-feedback">{errors.serialNumber}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={newAsset.status}
                      onChange={handleAddAssetChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Faulty">Faulty</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      name="location"
                      value={newAsset.location}
                      onChange={handleAddAssetChange}
                      placeholder="e.g., Warehouse, Zone A"
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-light"
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
            <div className="modal-content" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-fill me-2 text-primary"></i>
                  Edit Asset
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateAsset}>
                <div className="modal-body px-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Serial Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAsset.serialNumber}
                      disabled
                    />
                    <small className="text-muted">Serial number cannot be changed</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Model *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                      value={selectedAsset.model}
                      onChange={(e) => setSelectedAsset({...selectedAsset, model: e.target.value})}
                    />
                    {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={selectedAsset.status}
                      onChange={(e) => setSelectedAsset({...selectedAsset, status: e.target.value})}
                      disabled={selectedAsset.status === 'Assigned'}
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Faulty">Faulty</option>
                      <option value="Retired">Retired</option>
                    </select>
                    {selectedAsset.status === 'Assigned' && (
                      <small className="text-muted">Cannot change status of assigned asset</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      value={selectedAsset.location || ''}
                      onChange={(e) => setSelectedAsset({...selectedAsset, location: e.target.value})}
                    />
                    {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-light"
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