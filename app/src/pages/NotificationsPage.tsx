import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CalendarMonth,
  AttachMoney,
  Person,
  CheckCircle,
  MoreVert,
  Delete,
  DoneAll,
  FilterList,
} from "@mui/icons-material";

interface Notification {
  id: number;
  type: "appointment" | "payment" | "patient" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "appointment",
    title: "Nova consulta agendada",
    message: "Maria Silva agendou consulta para amanhã às 14h",
    time: "5 min atrás",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "payment",
    title: "Pagamento recebido",
    message: "João Santos - R$ 200,00 confirmado",
    time: "1 hora atrás",
    read: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "patient",
    title: "Novo paciente cadastrado",
    message: "Ana Costa completou o cadastro",
    time: "2 horas atrás",
    read: true,
    priority: "low",
  },
  {
    id: 4,
    type: "appointment",
    title: "Consulta cancelada",
    message: "Pedro Oliveira cancelou a consulta de amanhã",
    time: "3 horas atrás",
    read: true,
    priority: "high",
  },
  {
    id: 5,
    type: "system",
    title: "Relatório mensal disponível",
    message: "Seu relatório de dezembro está pronto",
    time: "1 dia atrás",
    read: true,
    priority: "low",
  },
  {
    id: 6,
    type: "payment",
    title: "Pagamento pendente",
    message: "Carlos Ferreira - Vencimento em 2 dias",
    time: "2 dias atrás",
    read: false,
    priority: "medium",
  },
];

const getNotificationIcon = (type: string) => {
  const icons = {
    appointment: <CalendarMonth />,
    payment: <AttachMoney />,
    patient: <Person />,
    system: <NotificationsIcon />,
  };
  return icons[type as keyof typeof icons] || <NotificationsIcon />;
};

const getNotificationColor = (type: string) => {
  const colors = {
    appointment: "#F59E0B",
    payment: "#10B981",
    patient: "#3B82F6",
    system: "#8B5CF6",
  };
  return colors[type as keyof typeof colors] || "#718096";
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
  };
  return colors[priority as keyof typeof colors] || "#718096";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    handleMenuClose();
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    handleMenuClose();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (tabValue === 0) return true; // Todas
    if (tabValue === 1) return !n.read; // Não lidas
    if (tabValue === 2) return n.read; // Lidas
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(135deg, #2BC7D4 0%, #16263F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A202C" }}>
              Notificações
            </Typography>
            <Typography variant="body2" sx={{ color: "#718096" }}>
              Acompanhe todas as atualizações do sistema
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              borderColor: "#E2E8F0",
              color: "#4A5568",
              "&:hover": {
                borderColor: "#2BC7D4",
                background: "rgba(43, 199, 212, 0.05)",
              },
            }}
          >
            Filtros
          </Button>
          <Button
            variant="contained"
            startIcon={<DoneAll />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            sx={{
              background: "linear-gradient(135deg, #2BC7D4 0%, #16263F 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1FA8B4 0%, #0F1419 100%)",
              },
            }}
          >
            Marcar todas como lidas
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box
          sx={{
            flex: 1,
            p: 2.5,
            background: "#FFFFFF",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#718096", mb: 0.5 }}>
            Total
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A202C" }}>
            {notifications.length}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2.5,
            background: "#FFFFFF",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#718096", mb: 0.5 }}>
            Não lidas
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#EF4444" }}>
            {unreadCount}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2.5,
            background: "#FFFFFF",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#718096", mb: 0.5 }}>
            Lidas
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#10B981" }}>
            {notifications.length - unreadCount}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 2.5,
            background: "#FFFFFF",
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#718096", mb: 0.5 }}>
            Alta prioridade
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#F59E0B" }}>
            {notifications.filter(n => n.priority === "high").length}
          </Typography>
        </Box>
      </Box>

      {/* Tabs e Lista */}
      <Box
        sx={{
          background: "#FFFFFF",
          borderRadius: 2,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: "1px solid #E2E8F0",
            "& .MuiTab-root": {
              color: "#718096",
              fontWeight: 600,
            },
            "& .Mui-selected": {
              color: "#2BC7D4",
            },
          }}
        >
          <Tab
            label={
              <Badge badgeContent={notifications.length} color="primary">
                Todas
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={unreadCount} color="error">
                Não lidas
              </Badge>
            }
          />
          <Tab label="Lidas" />
        </Tabs>

        <List sx={{ p: 0 }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <NotificationsIcon sx={{ fontSize: 64, color: "#CBD5E0", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#718096" }}>
                Nenhuma notificação encontrada
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Box key={notification.id}>
                <ListItem
                  sx={{
                    py: 2.5,
                    px: 3,
                    background: notification.read ? "transparent" : "rgba(43, 199, 212, 0.05)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "rgba(43, 199, 212, 0.08)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: getNotificationColor(notification.type),
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1A202C" }}>
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#2BC7D4",
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: "#4A5568", mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={notification.type}
                            size="small"
                            sx={{
                              background: `${getNotificationColor(notification.type)}22`,
                              color: getNotificationColor(notification.type),
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                          <Chip
                            label={notification.priority}
                            size="small"
                            sx={{
                              background: `${getPriorityColor(notification.priority)}22`,
                              color: getPriorityColor(notification.priority),
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                          <Typography variant="caption" sx={{ color: "#A0AEC0" }}>
                            {notification.time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />

                  <IconButton
                    onClick={(e) => handleMenuOpen(e, notification.id)}
                    sx={{ color: "#718096" }}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>

        {/* Menu de ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {selectedNotification && !notifications.find(n => n.id === selectedNotification)?.read && (
            <MenuItem onClick={() => markAsRead(selectedNotification)}>
              <CheckCircle fontSize="small" sx={{ mr: 1, color: "#10B981" }} />
              Marcar como lida
            </MenuItem>
          )}
          <MenuItem onClick={() => selectedNotification && deleteNotification(selectedNotification)}>
            <Delete fontSize="small" sx={{ mr: 1, color: "#EF4444" }} />
            Excluir
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
