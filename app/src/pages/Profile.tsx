import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dados do perfil
  const [profileData, setProfileData] = useState({
    name: 'Dr. Eduardo Silva',
    email: 'eduardo.silva@email.com',
    phone: '(11) 98765-4321',
    crp: 'CRP 06/123456',
    specialization: 'Psicologia ClÃ­nica',
    experience: '5 anos',
    address: 'SÃ£o Paulo, SP',
    bio: 'PsicÃ³logo clÃ­nico especializado em Terapia Cognitivo-Comportamental. Atuo principalmente com transtornos de ansiedade e depressÃ£o.',
  });

  // ConfiguraÃ§Ãµes
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    monthlyReport: false,
    darkMode: true,
    compactView: false,
    soundAlerts: true,
  });

  const handleSave = () => {
    setEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSettingChange = (setting: string) => {
    setSettings({ ...settings, [setting]: !settings[setting as keyof typeof settings] });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1A202C' }}>
        Meu Perfil
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3, background: '#10B981', color: '#1A202C' }}>
          Perfil atualizado com sucesso!
        </Alert>
      )}

      {/* Card do Header do Perfil */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
          border: '1px solid #E2E8F0',
          borderRadius: 2,
          p: 4,
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(43, 199, 212, 0.1) 0%, transparent 100%)',
            borderRadius: '50% 0 0 50%',
          }}
        />

        <Grid container spacing={3} alignItems="center" position="relative">
          <Grid item>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  background: 'linear-gradient(135deg, #2BC7D4 0%, #FFFFFF 100%)',
                  border: '4px solid #2BC7D4',
                  boxShadow: '0 8px 24px rgba(43, 199, 212, 0.4)',
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#2BC7D4',
                  '&:hover': { background: '#1FA8B4' },
                  width: 36,
                  height: 36,
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 18, color: '#1A202C' }} />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ color: '#1A202C', fontWeight: 700, mb: 0.5 }}>
              {profileData.name}
            </Typography>
            <Typography variant="h6" sx={{ color: '#2BC7D4', mb: 2 }}>
              {profileData.specialization}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<BadgeIcon />}
                label={profileData.crp}
                sx={{ background: '#FFFFFF', color: '#2BC7D4', border: '1px solid #2BC7D4' }}
              />
              <Chip
                icon={<WorkIcon />}
                label={`${profileData.experience} de experiÃªncia`}
                sx={{ background: '#FFFFFF', color: '#10B981', border: '1px solid #10B981' }}
              />
              <Chip
                icon={<LocationIcon />}
                label={profileData.address}
                sx={{ background: '#FFFFFF', color: '#F59E0B', border: '1px solid #F59E0B' }}
              />
            </Box>
          </Grid>
          <Grid item>
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  background: 'linear-gradient(135deg, #2BC7D4 0%, #FFFFFF 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1FA8B4 0%, #F5F7FA 100%)',
                  },
                }}
              >
                Editar Perfil
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ background: '#10B981', '&:hover': { background: '#059669' } }}
                >
                  Salvar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ borderColor: '#EF4444', color: '#EF4444' }}
                >
                  Cancelar
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: '1px solid #E2E8F0',
            '& .MuiTab-root': {
              color: '#718096',
              '&.Mui-selected': {
                color: '#2BC7D4',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2BC7D4',
              height: 3,
            },
          }}
        >
          <Tab label="InformaÃ§Ãµes Pessoais" icon={<BadgeIcon />} iconPosition="start" />
          <Tab label="SeguranÃ§a" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="NotificaÃ§Ãµes" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="PreferÃªncias" icon={<PaletteIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab 0 - InformaÃ§Ãµes Pessoais */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#1A202C', mb: 2 }}>
                  Dados BÃ¡sicos
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome Completo"
                  fullWidth
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="CRP"
                  fullWidth
                  value={profileData.crp}
                  onChange={(e) => setProfileData({ ...profileData, crp: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="EspecializaÃ§Ã£o"
                  fullWidth
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tempo de ExperiÃªncia"
                  fullWidth
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <WorkIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="EndereÃ§o"
                  fullWidth
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ mr: 1, color: '#718096' }} />,
                  }}
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Biografia"
                  fullWidth
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!editing}
                  sx={{ textarea: { color: '#1A202C' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Tab 1 - SeguranÃ§a */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              Alterar Senha
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Senha Atual"
                  fullWidth
                  type="password"
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}></Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nova Senha"
                  fullWidth
                  type="password"
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirmar Nova Senha"
                  fullWidth
                  type="password"
                  sx={{ input: { color: '#1A202C' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    background: '#2BC7D4',
                    '&:hover': { background: '#1FA8B4' },
                  }}
                >
                  Atualizar Senha
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: '#E2E8F0' }} />

            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              AutenticaÃ§Ã£o em Dois Fatores
            </Typography>
            <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <CardContent>
                <Typography variant="body1" sx={{ color: '#1A202C', mb: 2 }}>
                  Adicione uma camada extra de seguranÃ§a Ã  sua conta.
                </Typography>
                <Button variant="outlined" sx={{ borderColor: '#2BC7D4', color: '#2BC7D4' }}>
                  Configurar 2FA
                </Button>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Tab 2 - NotificaÃ§Ãµes */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              PreferÃªncias de NotificaÃ§Ã£o
            </Typography>
            <Stack spacing={2}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          NotificaÃ§Ãµes por Email
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Receba atualizaÃ§Ãµes sobre consultas e lembretes
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={() => handleSettingChange('pushNotifications')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          NotificaÃ§Ãµes Push
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Receba notificaÃ§Ãµes instantÃ¢neas no aplicativo
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.weeklyReport}
                        onChange={() => handleSettingChange('weeklyReport')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          RelatÃ³rio Semanal
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Resumo semanal de atividades
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monthlyReport}
                        onChange={() => handleSettingChange('monthlyReport')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          RelatÃ³rio Mensal
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          RelatÃ³rio completo mensal
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </TabPanel>

        {/* Tab 3 - PreferÃªncias */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              PreferÃªncias do Sistema
            </Typography>
            <Stack spacing={2}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={() => handleSettingChange('darkMode')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          Modo Escuro
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Interface com tema escuro
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.compactView}
                        onChange={() => handleSettingChange('compactView')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          VisualizaÃ§Ã£o Compacta
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Mostrar mais informaÃ§Ãµes em menos espaÃ§o
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>

              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.soundAlerts}
                        onChange={() => handleSettingChange('soundAlerts')}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#2BC7D4' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2BC7D4' },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ color: '#1A202C', fontWeight: 600 }}>
                          Alertas Sonoros
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Sons para notificaÃ§Ãµes e alertas
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

