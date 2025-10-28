import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NetworkTopology = () => {
  const [loading, setLoading] = useState(true);
  const [topologyData, setTopologyData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({
    headend: true,
    fdh: {},
    splitter: {}
  });

  useEffect(() => {
    fetchTopologyData();
  }, []);

  const fetchTopologyData = async () => {
    try {
      const response = await api.get('/network/topology');
      setTopologyData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching topology data:', error);
      setLoading(false);
    }
  };

  const toggleNode = (type, id) => {
    setExpandedNodes(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id]
      }
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': '#10b981',
      'Pending': '#f59e0b',
      'Inactive': '#6b7280',
      'Faulty': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const filterCustomers = (customers) => {
    if (!searchTerm) return customers;
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toString().includes(searchTerm)
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!topologyData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No network topology data available
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-diagram-3-fill me-2 text-info"></i>
            Network Topology
          </h2>
          <p className="text-muted mb-0">Visual representation of network hierarchy</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-primary" onClick={fetchTopologyData}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small fw-semibold text-uppercase">Total Splitters</p>
                  <h3 className="fw-bold mb-0">{topologyData.metrics.totalSplitters}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '45px', height: '45px', background: '#667eea20' }}>
                  <i className="bi bi-diagram-3 text-primary fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small fw-semibold text-uppercase">Active Ports</p>
                  <h3 className="fw-bold mb-0">
                    {topologyData.metrics.usedPorts}/{topologyData.metrics.totalPorts}
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '45px', height: '45px', background: '#10b98120' }}>
                  <i className="bi bi-plug text-success fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small fw-semibold text-uppercase">Port Utilization</p>
                  <h3 className="fw-bold mb-0">
                    {Math.round((topologyData.metrics.usedPorts / topologyData.metrics.totalPorts) * 100)}%
                  </h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '45px', height: '45px', background: '#3b82f620' }}>
                  <i className="bi bi-pie-chart text-info fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small fw-semibold text-uppercase">Active Customers</p>
                  <h3 className="fw-bold mb-0">{topologyData.metrics.activeCustomers}</h3>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '45px', height: '45px', background: '#10b98120' }}>
                  <i className="bi bi-people-fill text-success fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0">
            <div className="card-body">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by customer name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Hierarchy */}
      <div className="card border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-hierarchy me-2 text-primary"></i>
            Network Hierarchy
          </h5>
        </div>
        <div className="card-body p-4">
          
          {/* Headend (Root) */}
          <div className="mb-3">
            <div 
              className="d-flex align-items-center p-3 rounded cursor-pointer"
              style={{ background: '#667eea10', borderLeft: '4px solid #667eea' }}
              onClick={() => setExpandedNodes(prev => ({ ...prev, headend: !prev.headend }))}
            >
              <div className="me-3">
                <i className={`bi bi-${expandedNodes.headend ? 'dash' : 'plus'}-square fs-4 text-primary`}></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <i className="bi bi-hdd-rack-fill text-primary fs-3 me-3"></i>
                  <div>
                    <h5 className="mb-0 fw-bold">{topologyData.headend.name}</h5>
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {topologyData.headend.location} | {topologyData.headend.region}
                    </small>
                  </div>
                </div>
              </div>
              <div>
                <span className="badge bg-success">Active</span>
              </div>
            </div>

            {/* FDH Level */}
            {expandedNodes.headend && topologyData.fdhList && (
              <div className="ms-5 mt-3">
                {topologyData.fdhList.map((fdh) => (
                  <div key={fdh.fdhId} className="mb-3">
                    <div 
                      className="d-flex align-items-center p-3 rounded cursor-pointer"
                      style={{ background: '#10b98110', borderLeft: '4px solid #10b981' }}
                      onClick={() => toggleNode('fdh', fdh.fdhId)}
                    >
                      <div className="me-3">
                        <i className={`bi bi-${expandedNodes.fdh[fdh.fdhId] ? 'dash' : 'plus'}-square fs-5 text-success`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-hdd-network-fill text-success fs-4 me-3"></i>
                          <div>
                            <h6 className="mb-0 fw-semibold">{fdh.name}</h6>
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              {fdh.location} | Max Ports: {fdh.maxPorts}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="badge bg-info">{fdh.splitters?.length || 0} Splitters</span>
                      </div>
                    </div>

                    {/* Splitter Level */}
                    {expandedNodes.fdh[fdh.fdhId] && fdh.splitters && (
                      <div className="ms-5 mt-3">
                        {fdh.splitters.map((splitter) => (
                          <div key={splitter.splitterId} className="mb-3">
                            <div 
                              className="d-flex align-items-center p-3 rounded cursor-pointer"
                              style={{ background: '#3b82f610', borderLeft: '4px solid #3b82f6' }}
                              onClick={() => toggleNode('splitter', splitter.splitterId)}
                            >
                              <div className="me-3">
                                <i className={`bi bi-${expandedNodes.splitter[splitter.splitterId] ? 'dash' : 'plus'}-square text-info`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-diagram-3-fill text-info fs-5 me-3"></i>
                                  <div>
                                    <h6 className="mb-0">{splitter.model}</h6>
                                    <small className="text-muted">
                                      Capacity: {splitter.portCapacity} | Used: {splitter.usedPorts}
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="badge bg-primary">
                                  {splitter.customers?.length || 0} Customers
                                </span>
                              </div>
                            </div>

                            {/* Customer Level */}
                            {expandedNodes.splitter[splitter.splitterId] && splitter.customers && (
                              <div className="ms-5 mt-3">
                                {filterCustomers(splitter.customers).length > 0 ? (
                                  filterCustomers(splitter.customers).map((customer) => (
                                    <div 
                                      key={customer.customerId}
                                      className="d-flex align-items-center p-3 rounded mb-2"
                                      style={{ 
                                        background: '#f8f9fa',
                                        borderLeft: `4px solid ${getStatusColor(customer.status)}`
                                      }}
                                    >
                                      <i className="bi bi-person-circle fs-4 me-3" 
                                         style={{ color: getStatusColor(customer.status) }}></i>
                                      <div className="flex-grow-1">
                                        <h6 className="mb-0">{customer.name}</h6>
                                        <small className="text-muted">
                                          ID: #{customer.customerId} | Port: {customer.assignedPort} | {customer.plan}
                                        </small>
                                      </div>
                                      <div>
                                        <span 
                                          className="badge"
                                          style={{ 
                                            background: `${getStatusColor(customer.status)}20`,
                                            color: getStatusColor(customer.status)
                                          }}
                                        >
                                          {customer.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center text-muted py-3">
                                    <i className="bi bi-search"></i> No matching customers
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-semibold mb-3">Status Legend:</h6>
            <div className="row">
              <div className="col-md-3">
                <span className="badge bg-success me-2">●</span> Active
              </div>
              <div className="col-md-3">
                <span className="badge bg-warning me-2">●</span> Pending
              </div>
              <div className="col-md-3">
                <span className="badge bg-secondary me-2">●</span> Inactive
              </div>
              <div className="col-md-3">
                <span className="badge bg-danger me-2">●</span> Faulty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;