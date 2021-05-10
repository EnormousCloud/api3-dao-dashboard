import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from './dashboard-icon';
import ProposalsIcon from './proposals-icon';
import './menu.scss';

const Menu = () => {
  const { pathname } = useLocation();
  return (
    <div className="menu">
      <NavLink
        activeClassName="menu-active-item"
        to="/dashboard"
        isActive={() => ['/', '/dashboard'].includes(pathname)}
      >
        <div className="menu-item">
          <div className="menu-active-line" />
          <DashboardIcon />
        </div>
      </NavLink>
      <NavLink activeClassName="menu-active-item" to="/proposals">
        <div className="menu-item">
          <div className="menu-active-line" />
          <ProposalsIcon />
        </div>
      </NavLink>
    </div>
  );
};

export default Menu;