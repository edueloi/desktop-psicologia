import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import { Save, Backup, RestorePage } from "@mui/icons-material";
import api from "../services/api";

interface Settings {
  appointment_duration?: number;
  appointment_interval?: number;
  work_start_time?: string;
  work_end_time?: string;
  work_days?: number[];
  notification_email?: boolean;
  notification_sms?: boolean;
  notification_whatsapp?: boolean;
  reminder_hours_before?: number;
  currency?: string;
  timezone?: string;
  language?: string;
  theme?: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    appointment_duration: 50,
    appointment_interval: 10,
    work_start_time: "08:00",
    work_end_time: "18:00",
    notification_email: true,
    notification_sms: false,
    notification_whatsapp: true,
    reminder_hours_before: 24,
    theme: "light",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/settings");
      setSettings(response.data);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      setSnackbar({ open: true, message: "Erro ao carregar configurações", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/settings", settings);
      setSnackbar({ open: true, message: "Configurações salvas com sucesso!", severity: "success" });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setSnackbar({ open: true, message: "Erro ao salvar configurações", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings) => (event: any) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Configurações
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Agenda e Horários
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duraçéo da Sesséo (minutos)"
                  type="number"
                  fullWidth
                  value={settings.appointment_duration || 50}
                  onChange={handleChange("appointment_duration")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Intervalo entre Sessões (minutos)"
                  type="number"
                  fullWidth
                  value={settings.appointment_interval || 10}
                  onChange={handleChange("appointment_interval")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Horário de Início"
                  type="time"
                  fullWidth
                  value={settings.work_start_time || "08:00"}
                  onChange={handleChange("work_start_time")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Horário de Término"
                  type="time"
                  fullWidth
                  value={settings.work_end_time || "18:00"}
                  onChange={handleChange("work_end_time")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notificações
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification_email || false}
                      onChange={handleChange("notification_email")}
                    />
                  }
                  label="Notificações por Email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification_whatsapp || false}
                      onChange={handleChange("notification_whatsapp")}
                    />
                  }
                  label="Notificações por WhatsApp"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Lembrete (horas antes)"
                  type="number"
                  fullWidth
                  value={settings.reminder_hours_before || 24}
                  onChange={handleChange("reminder_hours_before")}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aparência
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tema"
                  select
                  fullWidth
                  value={settings.theme || "light"}
                  onChange={handleChange("theme")}
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Escuro</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Backup e Restauraçéo
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Faça backup dos seus dados regularmente para evitar perda de
              informações.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Button variant="contained" startIcon={<Backup />} fullWidth>
                Fazer Backup
              </Button>
              <Button variant="outlined" startIcon={<RestorePage />} fullWidth>
                Restaurar Backup
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sobre o Sistema
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>PsychDesk</strong> - Sistema de Gestéo para Psicologia
              <br />
              Verséo: 1.0.0
              <br />© 2025 - Todos os direitos reservados
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={loadSettings}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
