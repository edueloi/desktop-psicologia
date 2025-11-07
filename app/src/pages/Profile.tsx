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
    specialization: 'Psicologia Clínica',
    experience: '5 anos',
    address: 'Séo Paulo, SP',
    bio: 'Psicólogo clínico especializado em Terapia Cognitivo-Comportamental. Atuo principalmente com transtornos de ansiedade e depresséo.',
  });

  // Configurações
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
            background: 'rgba(59, 130, 246, 0.08)',
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
                  background: '#3B82F6',
                  border: '4px solid #60A5FA',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
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
                label={`${profileData.experience} de experiéªncia`}
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
                  background: '#3B82F6',
                  '&:hover': {
                    background: '#2563EB',
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
          <Tab label="Informaçéµes Pessoais" icon={<BadgeIcon />} iconPosition="start" />
          <Tab label="Segurança" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Notificaçéµes" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Preferéªncias" icon={<PaletteIcon />} iconPosition="start" />
        </Tabs>

        {/* Tab 0 - Informaçéµes Pessoais */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#1A202C', mb: 2 }}>
                  Dados Bé¡sicos
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
                  label="Especializaçéo"
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
                  label="Tempo de Experiéªncia"
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
                  label="Endereço"
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

        {/* Tab 1 - Segurança */}
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
              Autenticaçéo em Dois Fatores
            </Typography>
            <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <CardContent>
                <Typography variant="body1" sx={{ color: '#1A202C', mb: 2 }}>
                  Adicione uma camada extra de segurança é  sua conta.
                </Typography>
                <Button variant="outlined" sx={{ borderColor: '#2BC7D4', color: '#2BC7D4' }}>
                  Configurar 2FA
                </Button>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Tab 2 - Notificaçéµes */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              Preferéªncias de Notificaçéo
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
                          Notificaçéµes por Email
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Receba atualizaçéµes sobre consultas e lembretes
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
                          Notificaçéµes Push
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Receba notificaçéµes instanté¢neas no aplicativo
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
                          Relaté³rio Semanal
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
                          Relaté³rio Mensal
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Relaté³rio completo mensal
                        </Typography>
                      </Box>
                    }
                  />
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </TabPanel>

        {/* Tab 3 - Preferéªncias */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1A202C', mb: 3 }}>
              Preferéªncias do Sistema
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
                          Visualizaçéo Compacta
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          Mostrar mais informaçéµes em menos espaço
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
                          Sons para notificaçéµes e alertas
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

