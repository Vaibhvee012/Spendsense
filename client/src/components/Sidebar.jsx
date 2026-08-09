import { NavLink, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiFileChart2Line, RiHistoryLine, RiUserLine, RiSettings3Line, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';


const navItems = [
  { icon: RiDashboardLine, label: 'Dashboard', path: '/dashboard' },
  { icon: RiFileChart2Line, label: 'Reports', path: '/reports' },
  { icon: RiHistoryLine, label: 'History', path: '/history' },
  { icon: RiUserLine, label: 'Profile', path: '/profile' },
  { icon: RiSettings3Line, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-60 bg-surface border-r border-border min-h-screen flex flex-col justify-between py-6 px-4 sticky top-0">
      <div>
        <div className="flex items-center gap-2 px-2 mb-10">
          <img src={logo} alt="SpendSense" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-display font-semibold text-text">SpendSense</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent text-bg'
                    : 'text-text-muted hover:bg-surface-light hover:text-text'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-accent-2/20 flex items-center justify-center text-accent-2 font-semibold font-display text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-text text-sm font-medium">{user?.name}</p>
            <p className="text-text-muted text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-surface-light hover:text-red-400 transition"
        >
          <RiLogoutBoxLine size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;