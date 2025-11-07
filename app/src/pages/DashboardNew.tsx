import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  People,
  CalendarToday,
  EventBusy,
  Cake,
  TrendingUp,
  AttachMoney,
  CheckCircle,
  Schedule,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Assignment,
  Event,
} from '@mui/icons-material';
import api from '../services/api';

interface DashboardStats {
  totalPatients: number;
  sessionsToday: number;
  missedAppointments: number;
  upcomingBirthdays: number;
  monthlyRevenue: number;
  completedSessions: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'patient' | 'payment';
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    sessionsToday: 0,
    missedAppointments: 0,
    upcomingBirthdays: 0,
    monthlyRevenue: 0,
    completedSessions: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentActivities();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Mock data para demonstraçéo
      setStats({
        totalPatients: 47,
        sessionsToday: 5,
        missedAppointments: 2,
        upcomingBirthdays: 3,
        monthlyRevenue: 12500,
        completedSessions: 38,
        pendingTasks: 7,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = () => {
    // Mock data
    const activities: RecentActivity[] = [
      { id: '1', type: 'appointment', title: 'Consulta com Maria Silva', subtitle: 'Agendada para hoje é s 14:00', time: '2h', color: '#2BC7D4' },
      { id: '2', type: 'patient', title: 'Novo paciente cadastrado', subtitle: 'Joéo Santos', time: '3h', color: '#10B981' },
      { id: '3', type: 'payment', title: 'Pagamento recebido', subtitle: 'R$ 200,00 - Ana Costa', time: '5h', color: '#F59E0B' },
      { id: '4', type: 'appointment', title: 'Consulta conclué­da', subtitle: 'Pedro Oliveira', time: '1d', color: '#8B5CF6' },
    ];
    setRecentActivities(activities);
  };

  const statCards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPatients || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#2BC7D4',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Sesséµes Hoje',
      value: stats.sessionsToday || 0,
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      color: '#10B981',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${(stats.monthlyRevenue || 0).toLocaleString('pt-BR')}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#F59E0B',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Sesséµes Conclué­das',
      value: stats.completedSessions || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#8B5CF6',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Faltas no Méªs',
      value: stats.missedAppointments || 0,
      icon: <EventBusy sx={{ fontSize: 40 }} />,
      color: '#EF4444',
      change: '-3%',
      trend: 'down',
    },
    {
      title: 'Aniversé¡rios',
      value: stats.upcomingBirthdays || 0,
      icon: <Cake sx={{ fontSize: 40 }} />,
      color: '#EC4899',
      change: '',
      trend: 'neutral',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A202C', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#8A92A0' }}>
          Bem-vindo de volta! Aqui esté¡ um resumo das suas atividades.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
                border: '1px solid #E2E8F0',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 24px ${card.color}44`,
                  borderColor: card.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: card.color,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Avatar
                    sx={{
                      background: `linear-gradient(135deg, ${card.color}33 0%, ${card.color}11 100%)`,
                      color: card.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  {card.change && (
                    <Chip
                      icon={card.trend === 'up' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                      label={card.change}
                      size="small"
                      sx={{
                        background: card.trend === 'up' ? '#10B98122' : '#EF444422',
                        color: card.trend === 'up' ? '#10B981' : '#EF4444',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h4" sx={{ color: '#1A202C', fontWeight: 700, mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#8A92A0' }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Progresso do Méªs */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1A202C', fontWeight: 600 }}>
                Progresso do Méªs
              </Typography>
              <IconButton size="small">
                <MoreVert sx={{ color: '#8A92A0' }} />
              </IconButton>
            </Box>

            <Stack spacing={3}>
              {/* Meta de Sesséµes */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                    Meta de Sesséµes
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2BC7D4', fontWeight: 600 }}>
                    38/50
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={76}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: '#F5F7FA',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2BC7D4 0%, #FFFFFF 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {/* Meta de Receita */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                    Meta de Receita
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                    R$ 12.500/15.000
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={83}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: '#F5F7FA',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {/* Taxa de Presença */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                    Taxa de Presença
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                    95%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={95}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: '#F5F7FA',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: '#1A202C', fontWeight: 600, mb: 3 }}>
              Açéµes Ré¡pidas
            </Typography>
            <Stack spacing={2}>
              <Card
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#2BC7D4',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                  <Avatar sx={{ background: '#2BC7D433', color: '#2BC7D4' }}>
                    <Event />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                      Nova Consulta
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                      Agendar atendimento
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#10B981',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                  <Avatar sx={{ background: '#10B98133', color: '#10B981' }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                      Novo Paciente
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                      Cadastrar paciente
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card
                sx={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#F59E0B',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                  <Avatar sx={{ background: '#F59E0B33', color: '#F59E0B' }}>
                    <Assignment />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                      Ver Relaté³rios
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                      Ané¡lises e estaté­sticas
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Paper>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12}>
          <Paper
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1A202C', fontWeight: 600 }}>
                Atividades Recentes
              </Typography>
              <IconButton size="small">
                <MoreVert sx={{ color: '#8A92A0' }} />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              {recentActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: `${activity.color}33`, color: activity.color, width: 40, height: 40 }}>
                      {activity.type === 'appointment' && <Event />}
                      {activity.type === 'patient' && <People />}
                      {activity.type === 'payment' && <AttachMoney />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: '#1A202C', fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                        {activity.subtitle}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                  {index < recentActivities.length - 1 && (
                    <Divider sx={{ mt: 2, borderColor: '#E2E8F0' }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

