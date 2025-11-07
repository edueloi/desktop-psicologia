import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Save, Backup, RestorePage } from "@mui/icons-material";

export default function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Configurações
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dados do Profissional
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nome Completo"
                  fullWidth
                  defaultValue="Dr. Eduardo"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField label="CRP" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" type="email" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Telefone" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" startIcon={<Save />}>
                  Salvar Alterações
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Backup e Restauração
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

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sobre o Sistema
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>PsychDesk</strong> - Sistema de Gestão para Psicologia
              <br />
              Versão: 1.0.0
              <br />© 2025 - Todos os direitos reservados
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
