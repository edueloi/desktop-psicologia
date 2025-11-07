import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Chip,
  Grid,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import api from '../services/api';
import { format, add, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DURACOES = [
  { value: 10, label: '10 minutos' },
  { value: 20, label: '20 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h 30min' },
  { value: 120, label: '2 horas' },
];

const TIPOS_SESSAO = [
  'Psicoterapia',
  'Avaliação Psicológica',
  'Orientação',
  'Primeira Consulta',
  'Retorno',
  'Supervisão',
  'Outro',
];

const TIPOS_EVENTO = [
  'Reunião',
  'Compromisso Pessoal',
  'Férias',
  'Bloqueio de Horário',
  'Outro',
];

const METODOS_PAGAMENTO = [
  'Dinheiro',
  'PIX',
  'Cartão de Débito',
  'Cartão de Crédito',
  'Transferência',
];

const FREQUENCIAS = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal (a cada 2 semanas)' },
  { value: 'mensal', label: 'Mensal' },
];

const CORES_EVENTOS = [
  { value: '#1976d2', label: 'Azul' },
  { value: '#2e7d32', label: 'Verde' },
  { value: '#ed6c02', label: 'Laranja' },
  { value: '#9c27b0', label: 'Roxo' },
  { value: '#d32f2f', label: 'Vermelho' },
  { value: '#0288d1', label: 'Ciano' },
];

function AppointmentsCalendar() {
  const [events, setEvents] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'consulta' | 'evento'>('consulta');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Form fields
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatientName, setNewPatientName] = useState('');
  const [duration, setDuration] = useState(60);
  const [tipoSessao, setTipoSessao] = useState('Psicoterapia');
  const [valor, setValor] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('PIX');
  const [statusPagamento, setStatusPagamento] = useState('pendente');
  const [notes, setNotes] = useState('');
  
  // Recorrência
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [frequencia, setFrequencia] = useState('semanal');
  const [dataTermino, setDataTermino] = useState('');
  
  // Evento
  const [tituloEvento, setTituloEvento] = useState('');
  const [tipoEvento, setTipoEvento] = useState('Reunião');
  const [corEvento, setCorEvento] = useState('#1976d2');

  useEffect(() => {
    loadEvents();
    loadPatients();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/appointments');
      const formattedEvents = response.data.map((apt: any) => ({
        id: apt.id,
        title: apt.is_evento 
          ? apt.notes || apt.tipo_evento
          : `${apt.patient_name} - ${apt.tipo_sessao || 'Consulta'}`,
        start: apt.date_time,
        end: apt.end_time,
        backgroundColor: apt.is_evento ? apt.cor : (apt.status_pagamento === 'pago' ? '#2e7d32' : '#1976d2'),
        extendedProps: apt,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(format(info.date, 'yyyy-MM-dd'));
    setSelectedTime(format(info.date, 'HH:mm'));
    setDialogType('consulta');
    setDialogOpen(true);
  };

  const handleEventClick = (info: any) => {
    const event = info.event.extendedProps;
    console.log('Evento clicado:', event);
    // TODO: Abrir modal de edição
  };

  const handleNovoEvento = () => {
    const now = new Date();
    setSelectedDate(format(now, 'yyyy-MM-dd'));
    setSelectedTime(format(now, 'HH:mm'));
    setDialogType('evento');
    setDialogOpen(true);
  };

  const handleNovaConsulta = () => {
    const now = new Date();
    setSelectedDate(format(now, 'yyyy-MM-dd'));
    setSelectedTime(format(now, 'HH:mm'));
    setDialogType('consulta');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setNewPatientName('');
    setDuration(60);
    setTipoSessao('Psicoterapia');
    setValor('');
    setMetodoPagamento('PIX');
    setStatusPagamento('pendente');
    setNotes('');
    setIsRecorrente(false);
    setFrequencia('semanal');
    setDataTermino('');
    setTituloEvento('');
    setTipoEvento('Reunião');
    setCorEvento('#1976d2');
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === 'consulta') {
        await handleSubmitConsulta();
      } else {
        await handleSubmitEvento();
      }
      handleCloseDialog();
      loadEvents();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar agendamento');
    }
  };

  const handleSubmitConsulta = async () => {
    let patientId = selectedPatient?.id;
    
    // Criar paciente rápido se necessário
    if (!patientId && newPatientName.trim()) {
      const response = await api.post('/patients', {
        name: newPatientName,
        email: `temp_${Date.now()}@temp.com`,
        phone: '',
      });
      patientId = response.data.id;
    }

    if (!patientId) {
      alert('Selecione ou crie um paciente');
      return;
    }

    const dateTime = `${selectedDate}T${selectedTime}:00`;
    const endTime = format(
      add(parseISO(dateTime), { minutes: duration }),
      "yyyy-MM-dd'T'HH:mm:ss"
    );

    const appointmentData = {
      patient_id: patientId,
      date_time: dateTime,
      end_time: endTime,
      duration,
      tipo_sessao: tipoSessao,
      valor: valor ? parseFloat(valor) : null,
      metodo_pagamento: metodoPagamento,
      status_pagamento: statusPagamento,
      status: 'agendado',
      notes,
      is_evento: false,
    };

    if (isRecorrente && dataTermino) {
      await api.post('/appointments/recorrente', {
        ...appointmentData,
        frequencia,
        data_termino: dataTermino,
      });
    } else {
      await api.post('/appointments', appointmentData);
    }
  };

  const handleSubmitEvento = async () => {
    const dateTime = `${selectedDate}T${selectedTime}:00`;
    const endTime = format(
      add(parseISO(dateTime), { minutes: duration }),
      "yyyy-MM-dd'T'HH:mm:ss"
    );

    await api.post('/appointments', {
      date_time: dateTime,
      end_time: endTime,
      duration,
      notes: tituloEvento,
      tipo_evento: tipoEvento,
      cor: corEvento,
      is_evento: true,
      status: 'agendado',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Agenda</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<EventAvailableIcon />}
            onClick={handleNovaConsulta}
            sx={{ mr: 1 }}
          >
            Nova Consulta
          </Button>
          <Button
            variant="outlined"
            startIcon={<EventIcon />}
            onClick={handleNovoEvento}
          >
            Novo Evento
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          locale="pt-br"
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista',
          }}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:15:00"
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          allDaySlot={false}
          nowIndicator={true}
          selectable={true}
          selectMirror={true}
        />
      </Paper>

      {/* Dialog de Agendamento */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'consulta' ? 'Nova Consulta' : 'Novo Evento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Data"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Horário"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                select
                label="Duração"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                fullWidth
              >
                {DURACOES.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {dialogType === 'consulta' ? (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    options={patients}
                    getOptionLabel={(option: any) => option.name}
                    value={selectedPatient}
                    onChange={(_, newValue) => setSelectedPatient(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Paciente" />
                    )}
                  />
                </Grid>

                {!selectedPatient && (
                  <Grid item xs={12}>
                    <TextField
                      label="Ou criar novo paciente (nome rápido)"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      fullWidth
                      helperText="Você pode adicionar mais detalhes depois na aba Pacientes"
                    />
                  </Grid>
                )}

                <Grid item xs={6}>
                  <TextField
                    select
                    label="Tipo de Sessão"
                    value={tipoSessao}
                    onChange={(e) => setTipoSessao(e.target.value)}
                    fullWidth
                  >
                    {TIPOS_SESSAO.map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Valor (R$)"
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    label="Método de Pagamento"
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                    fullWidth
                  >
                    {METODOS_PAGAMENTO.map((metodo) => (
                      <MenuItem key={metodo} value={metodo}>
                        {metodo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    label="Status Pagamento"
                    value={statusPagamento}
                    onChange={(e) => setStatusPagamento(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="pago">Pago</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isRecorrente}
                        onChange={(e) => setIsRecorrente(e.target.checked)}
                      />
                    }
                    label="Agendamento recorrente"
                  />
                </Grid>

                {isRecorrente && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Frequência"
                        value={frequencia}
                        onChange={(e) => setFrequencia(e.target.value)}
                        fullWidth
                      >
                        {FREQUENCIAS.map((freq) => (
                          <MenuItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Repetir até"
                        type="date"
                        value={dataTermino}
                        onChange={(e) => setDataTermino(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Título do Evento"
                    value={tituloEvento}
                    onChange={(e) => setTituloEvento(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    label="Tipo de Evento"
                    value={tipoEvento}
                    onChange={(e) => setTipoEvento(e.target.value)}
                    fullWidth
                  >
                    {TIPOS_EVENTO.map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    select
                    label="Cor"
                    value={corEvento}
                    onChange={(e) => setCorEvento(e.target.value)}
                    fullWidth
                  >
                    {CORES_EVENTOS.map((cor) => (
                      <MenuItem key={cor.value} value={cor.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: cor.value,
                              borderRadius: 1,
                            }}
                          />
                          {cor.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="Observações"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AppointmentsCalendar;
