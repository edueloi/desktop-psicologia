import { Box, Typography, Paper } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

export default function Appointments() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Agenda
      </Typography>

      <Paper
        sx={{
          p: 4,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CalendarMonth sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Calendário de Agendamentos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Funcionalidade em desenvolvimento
        </Typography>
      </Paper>
    </Box>
  );
}
