const Footer = () => {
  return (
    <footer className="bg-light border-top mt-auto py-4">
      <div className="container-fluid px-4">
        <div className="row align-items-center">
          
          {/* Left - Copyright */}
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted small">
              © 2025 <strong>FiberFlow</strong>. All rights reserved.
            </p>
          </div>

          {/* Right - Links */}
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-muted text-decoration-none small me-3 hover-primary">
              <i className="bi bi-info-circle me-1"></i>Help
            </a>
            <a href="#" className="text-muted text-decoration-none small me-3 hover-primary">
              <i className="bi bi-book me-1"></i>Documentation
            </a>
            <a href="#" className="text-muted text-decoration-none small hover-primary">
              <i className="bi bi-telephone me-1"></i>Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;