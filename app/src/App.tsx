import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/DashboardNew";
import Patients from "./pages/Patients";
import AppointmentsCalendar from "./pages/AppointmentsCalendar";
import Billing from "./pages/Billing";
import Kanban from "./pages/KanbanBoards";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import SearchPage from "./pages/SearchPage";
import Help from "./pages/Help";

// ===================== THEME =====================
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0BA5A5", // teal calmo (clínico)
      light: "#4ED6D1",
      dark: "#098489",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1F2937", // slate/graphite discreto
      light: "#2B394A",
      dark: "#111827",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F7FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#64748B",
    },
    divider: "rgba(15, 23, 42, 0.08)",
    success: { main: "#10B981" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
    info: { main: "#3B82F6" },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 700, letterSpacing: 0.2 },
    h5: { fontWeight: 600, letterSpacing: 0.2 },
    h6: { fontWeight: 600, letterSpacing: 0.15 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.55 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0.2 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 2px 6px rgba(15,23,42,0.06)",
    "0 6px 12px rgba(15,23,42,0.08)",
    "0 10px 16px rgba(15,23,42,0.08)",
    "0 14px 28px rgba(15,23,42,0.10)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
    "0 1px 2px rgba(15,23,42,0.06)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7FAFC",
        },
        "*::selection": {
          background: "rgba(11,165,165,0.18)",
        },
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          background: "rgba(100,116,139,0.35)",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          background: "rgba(100,116,139,0.55)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "saturate(180%) blur(8px)",
          color: "#1F2937",
          boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
          border: "1px solid rgba(15,23,42,0.05)",
          transition: "transform .15s ease, box-shadow .15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(15,23,42,0.08)",
          },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
          "&.Mui-focusVisible": {
            outline: "3px solid rgba(11,165,165,0.35)",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 6px 10px rgba(11,165,165,0.18)",
          },
        },
        textSecondary: { color: "#334155" },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
            "& fieldset": {
              borderColor: "rgba(15,23,42,0.10)",
            },
            "&:hover fieldset": {
              borderColor: "#0BA5A5",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0BA5A5",
              boxShadow: "0 0 0 3px rgba(11,165,165,0.12)",
            },
          },
          "& .MuiInputLabel-root": { color: "#64748B" },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: { root: { color: "#64748B" } },
    },

    MuiSelect: {
      styleOverrides: {
        select: { "&:focus": { backgroundColor: "transparent" } },
        icon: { color: "#64748B" },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "rgba(15,23,42,0.35)",
          "&.Mui-checked": { color: "#0BA5A5" },
          "&.Mui-focusVisible": {
            outline: "3px solid rgba(11,165,165,0.35)",
            outlineOffset: 2,
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": { color: "#0BA5A5" },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0BA5A5" },
        },
        track: { backgroundColor: "rgba(15,23,42,0.2)" },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "&.Mui-selected": {
            backgroundColor: "rgba(11,165,165,0.10)",
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
              color: "#0BA5A5",
              fontWeight: 600,
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(11,165,165,0.14)",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 600 },
        colorSuccess: {
          backgroundColor: "rgba(16,185,129,0.12)",
          color: "#047857",
        },
        colorWarning: {
          backgroundColor: "rgba(245,158,11,0.12)",
          color: "#92400E",
        },
        colorError: {
          backgroundColor: "rgba(239,68,68,0.12)",
          color: "#991B1B",
        },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(15,23,42,0.08)" } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: 12.5,
          backgroundColor: "#111827",
        },
      },
    },
  },
});
// ===================== /THEME =====================

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="appointments" element={<AppointmentsCalendar />} />
                <Route path="billing" element={<Billing />} />
                <Route path="kanban" element={<Kanban />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="help" element={<Help />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
