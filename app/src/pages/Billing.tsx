import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Billing() {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  
  // Estatísticas
  const [stats, setStats] = useState({
    totalReceita: 0,
    totalPago: 0,
    totalPendente: 0,
    totalSessoes: 0,
    sessoesPagas: 0,
    sessoesPendentes: 0,
  });

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      const response = await api.get('/appointments');
      const allAppointments = response.data;

      // Filtrar por mês selecionado
      const monthStart = startOfMonth(parseISO(selectedMonth + '-01'));
      const monthEnd = endOfMonth(monthStart);

      const filtered = allAppointments.filter((apt: any) => {
        const aptDate = parseISO(apt.date_time);
        return aptDate >= monthStart && aptDate <= monthEnd && !apt.is_evento;
      });

      setAppointments(filtered);
      calculateStats(filtered);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const calculateStats = (data: any[]) => {
    const totalReceita = data.reduce((sum, apt) => sum + (parseFloat(apt.valor) || 0), 0);
    const pagos = data.filter((apt) => apt.status_pagamento === 'pago');
    const pendentes = data.filter((apt) => apt.status_pagamento === 'pendente');

    setStats({
      totalReceita,
      totalPago: pagos.reduce((sum, apt) => sum + (parseFloat(apt.valor) || 0), 0),
      totalPendente: pendentes.reduce((sum, apt) => sum + (parseFloat(apt.valor) || 0), 0),
      totalSessoes: data.length,
      sessoesPagas: pagos.length,
      sessoesPendentes: pendentes.length,
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/appointments/${id}`, { status_pagamento: newStatus });
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Faturamento</Typography>
        <TextField
          label="Mês"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 200 }}
        />
      </Box>

      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Receita Total
                  </Typography>
                  <Typography variant="h5">{formatCurrency(stats.totalReceita)}</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Recebido
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(stats.totalPago)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stats.sessoesPagas} sessões
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    A Receber
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    {formatCurrency(stats.totalPendente)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stats.sessoesPendentes} sessões
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total de Sessões
                  </Typography>
                  <Typography variant="h5">{stats.totalSessoes}</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Todas" />
          <Tab label="Pagas" />
          <Tab label="Pendentes" />
          <Tab label="Canceladas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AppointmentTable
            appointments={appointments}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            handleUpdateStatus={handleUpdateStatus}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AppointmentTable
            appointments={appointments.filter((apt: any) => apt.status_pagamento === 'pago')}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            handleUpdateStatus={handleUpdateStatus}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AppointmentTable
            appointments={appointments.filter((apt: any) => apt.status_pagamento === 'pendente')}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            handleUpdateStatus={handleUpdateStatus}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AppointmentTable
            appointments={appointments.filter((apt: any) => apt.status_pagamento === 'cancelado')}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            handleUpdateStatus={handleUpdateStatus}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
}

function AppointmentTable({
  appointments,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  handleUpdateStatus,
}: any) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data/Hora</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Tipo de Sessão</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((apt: any) => (
              <TableRow key={apt.id}>
                <TableCell>
                  {format(parseISO(apt.date_time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>{apt.patient_name}</TableCell>
                <TableCell>{apt.tipo_sessao || '-'}</TableCell>
                <TableCell>{apt.valor ? formatCurrency(parseFloat(apt.valor)) : '-'}</TableCell>
                <TableCell>{apt.metodo_pagamento || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(apt.status_pagamento)}
                    color={getStatusColor(apt.status_pagamento)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {apt.status_pagamento === 'pendente' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => handleUpdateStatus(apt.id, 'pago')}
                    >
                      Marcar como Pago
                    </Button>
                  )}
                  {apt.status_pagamento === 'pago' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => handleUpdateStatus(apt.id, 'pendente')}
                    >
                      Marcar como Pendente
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Billing;
