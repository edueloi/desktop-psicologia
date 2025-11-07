import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Psychology,
  AccountCircle,
  Logout,
  AttachMoney as AttachMoneyIcon,
  ViewKanban as ViewKanbanIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  ChevronLeft,
  Brightness4,
  Help,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/", color: "#2BC7D4" },
  { text: "Pacientes", icon: <PeopleIcon />, path: "/patients", color: "#10B981" },
  { text: "Agenda", icon: <CalendarIcon />, path: "/appointments", color: "#F59E0B" },
  { text: "Faturamento", icon: <AttachMoneyIcon />, path: "/billing", color: "#3B82F6" },
  { text: "Kanban", icon: <ViewKanbanIcon />, path: "/kanban", color: "#8B5CF6" },
  { text: "Relatórios", icon: <ReportsIcon />, path: "/reports", color: "#EC4899" },
];

const bottomMenuItems = [
  { text: "Configurações", icon: <SettingsIcon />, path: "/settings" },
  { text: "Ajuda", icon: <Help />, path: "/help" },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState([
    { id: 1, text: "Nova consulta agendada", time: "5 min", unread: true },
    { id: 2, text: "Relatório mensal disponível", time: "1 hora", unread: true },
    { id: 3, text: "Pagamento recebido", time: "2 horas", unread: false },
  ]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Box sx={{ display: "flex", background: "#F5F7FA", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ 
                color: "#052c65",
                "&:hover": { 
                  background: "rgba(59, 130, 246, 0.1)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            <Psychology sx={{ fontSize: 32, color: "#3B82F6" }} />
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: "#052c65",
              }}
            >
              PsychDesk Pro
            </Typography>
            <Chip 
              label="v2.0" 
              size="small" 
              sx={{ 
                background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)", 
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.75rem",
              }} 
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Busca rápida */}
            <Tooltip title="Busca rápida">
              <IconButton 
                onClick={() => navigate("/search")}
                sx={{ 
                  color: "#4A5568",
                  "&:hover": { 
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#3B82F6",
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Notificações */}
            <Tooltip title="Notificações">
              <IconButton 
                onClick={() => navigate("/notifications")}
                sx={{ 
                  color: "#4A5568",
                  "&:hover": { 
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#3B82F6",
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menu de notificações */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  minWidth: 320,
                  maxHeight: 400,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0" }}>
                <Typography variant="h6" sx={{ color: "#1A202C" }}>
                  Notificações
                </Typography>
              </Box>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  sx={{
                    background: notification.unread ? "rgba(59, 130, 246, 0.08)" : "transparent",
                    "&:hover": { background: "rgba(59, 130, 246, 0.12)" },
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2" sx={{ color: "#1A202C" }}>
                      {notification.text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#718096" }}>
                      {notification.time} atrás
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            {/* Tema */}
            <Tooltip title="Tema">
              <IconButton 
                sx={{ 
                  color: "#4A5568",
                  "&:hover": { 
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#3B82F6",
                  },
                }}
              >
                <Brightness4 />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "#E2E8F0" }} />

            {/* Perfil do usuário */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A202C" }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#718096" }}>
                  Psicólogo
                </Typography>
              </Box>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg, #3B82F6 0%, #052c65 100%)",
                    border: "2px solid #60A5FA",
                    fontWeight: 600,
                    "&:hover": {
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {user?.name.charAt(0)}
                </Avatar>
              </IconButton>
            </Box>

            {/* Menu do perfil */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  minWidth: 200,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
                sx={{ "&:hover": { background: "rgba(59, 130, 246, 0.1)" } }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" sx={{ color: "#3B82F6" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "#1A202C" }}>Meu Perfil</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/settings");
                }}
                sx={{ "&:hover": { background: "rgba(59, 130, 246, 0.1)" } }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: "#3B82F6" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "#1A202C" }}>Configurações</ListItemText>
              </MenuItem>
              <Divider sx={{ borderColor: "#E2E8F0" }} />
              <MenuItem
                onClick={handleLogout}
                sx={{ "&:hover": { background: "rgba(239, 68, 68, 0.1)" } }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#EF4444" }} />
                </ListItemIcon>
                <ListItemText sx={{ color: "#EF4444" }}>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidth : 72,
          flexShrink: 0,
          transition: "width 0.3s ease",
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 72,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #052c65 0%, #041d45 100%)",
            borderRight: "none",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", display: "flex", flexDirection: "column", height: "100%" }}>
          <List sx={{ px: 1, py: 2 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      background: isActive
                        ? "rgba(59, 130, 246, 0.2)"
                        : "transparent",
                      borderLeft: isActive ? `4px solid #60A5FA` : "4px solid transparent",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.15)",
                        transform: "translateX(4px)",
                      },
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": isActive ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(90deg, rgba(96, 165, 250, 0.2) 0%, transparent 100%)",
                      } : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#60A5FA" : "#94A3B8",
                        minWidth: 40,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: isActive ? "#FFFFFF" : "#CBD5E1",
                            fontWeight: isActive ? 600 : 400,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mx: 2, mb: 2 }} />

          <List sx={{ px: 1, pb: 2 }}>
            {bottomMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      background: isActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.15)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#60A5FA" : "#94A3B8",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: isActive ? "#FFFFFF" : "#CBD5E1",
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: "#F5F7FA",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box 
          className="animate-fade-in"
          sx={{
            maxWidth: "1600px",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
