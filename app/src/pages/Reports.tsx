import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { Assessment, PictureAsPdf, TableChart } from "@mui/icons-material";

export default function Reports() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Relatórios
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Assessment sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Relatório de Sessões
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Visualize estatísticas das sessões realizadas
            </Typography>
            <Button variant="outlined" startIcon={<PictureAsPdf />}>
              Gerar PDF
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <TableChart sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Relatório de Pacientes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Lista completa de pacientes e informações
            </Typography>
            <Button variant="outlined" startIcon={<PictureAsPdf />}>
              Gerar PDF
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Assessment sx={{ fontSize: 60, color: "warning.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Relatório Financeiro
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Acompanhe pagamentos e valores
            </Typography>
            <Button variant="outlined" startIcon={<PictureAsPdf />}>
              Gerar PDF
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
