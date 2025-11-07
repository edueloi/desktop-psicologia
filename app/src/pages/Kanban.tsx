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
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Autocomplete,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../services/api';
import { format, parseISO } from 'date-fns';

const PRIORITY_COLORS = {
  baixa: '#2e7d32',
  media: '#ed6c02',
  alta: '#d32f2f',
};

function Kanban() {
  const [columns, setColumns] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  // Dialogs
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  
  // Form states
  const [columnTitle, setColumnTitle] = useState('');
  const [columnColor, setColumnColor] = useState('#1976d2');
  const [editingColumn, setEditingColumn] = useState<any>(null);
  
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardPriority, setCardPriority] = useState('media');
  const [cardDueDate, setCardDueDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<any>(null);
  const [editingCard, setEditingCard] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [columnsRes, cardsRes, patientsRes, appointmentsRes] = await Promise.all([
        api.get('/kanban/columns'),
        api.get('/kanban/cards'),
        api.get('/patients'),
        api.get('/appointments'),
      ]);
      
      setColumns(columnsRes.data.sort((a: any, b: any) => a.position - b.position));
      setCards(cardsRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Se mudou de coluna
    if (source.droppableId !== destination.droppableId) {
      const card = cards.find((c) => c.id === draggableId);
      const updatedCard = { ...card, column_id: destination.droppableId };
      
      try {
        await api.put(`/kanban/cards/${draggableId}`, { column_id: destination.droppableId });
        setCards((prev) =>
          prev.map((c) => (c.id === draggableId ? updatedCard : c))
        );
      } catch (error) {
        console.error('Erro ao mover card:', error);
      }
    }
  };

  const handleOpenColumnDialog = (column: any = null) => {
    if (column) {
      setEditingColumn(column);
      setColumnTitle(column.title);
      setColumnColor(column.color);
    } else {
      setEditingColumn(null);
      setColumnTitle('');
      setColumnColor('#1976d2');
    }
    setColumnDialogOpen(true);
  };

  const handleOpenCardDialog = (columnId: string, card: any = null) => {
    setSelectedColumn(columns.find((c) => c.id === columnId));
    
    if (card) {
      setEditingCard(card);
      setCardTitle(card.title);
      setCardDescription(card.description || '');
      setCardPriority(card.priority);
      setCardDueDate(card.due_date || '');
      setSelectedPatient(patients.find((p) => p.id === card.patient_id) || null);
      setSelectedAppointment(appointments.find((a) => a.id === card.appointment_id) || null);
    } else {
      setEditingCard(null);
      resetCardForm();
    }
    
    setCardDialogOpen(true);
  };

  const resetCardForm = () => {
    setCardTitle('');
    setCardDescription('');
    setCardPriority('media');
    setCardDueDate('');
    setSelectedPatient(null);
    setSelectedAppointment(null);
  };

  const handleSaveColumn = async () => {
    try {
      const columnData = {
        title: columnTitle,
        color: columnColor,
        position: editingColumn ? editingColumn.position : columns.length,
      };

      if (editingColumn) {
        await api.put(`/kanban/columns/${editingColumn.id}`, columnData);
      } else {
        await api.post('/kanban/columns', columnData);
      }

      loadData();
      setColumnDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar coluna:', error);
    }
  };

  const handleSaveCard = async () => {
    try {
      const cardData = {
        column_id: selectedColumn.id,
        title: cardTitle,
        description: cardDescription,
        priority: cardPriority,
        due_date: cardDueDate || null,
        patient_id: selectedPatient?.id || null,
        appointment_id: selectedAppointment?.id || null,
        position: editingCard ? editingCard.position : cards.filter((c) => c.column_id === selectedColumn.id).length,
      };

      if (editingCard) {
        await api.put(`/kanban/cards/${editingCard.id}`, cardData);
      } else {
        await api.post('/kanban/cards', cardData);
      }

      loadData();
      setCardDialogOpen(false);
      resetCardForm();
    } catch (error) {
      console.error('Erro ao salvar card:', error);
    }
  };

  const handleDeleteColumn = async (id: string) => {
    if (!confirm('Deletar esta coluna e todos os cards dentro dela?')) return;
    
    try {
      await api.delete(`/kanban/columns/${id}`);
      loadData();
    } catch (error) {
      console.error('Erro ao deletar coluna:', error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Deletar este card?')) return;
    
    try {
      await api.delete(`/kanban/cards/${id}`);
      loadData();
    } catch (error) {
      console.error('Erro ao deletar card:', error);
    }
  };

  const getColumnCards = (columnId: string) => {
    return cards.filter((card) => card.column_id === columnId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Kanban</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenColumnDialog()}
        >
          Nova Coluna
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {columns.map((column) => (
            <Paper
              key={column.id}
              sx={{
                minWidth: 300,
                maxWidth: 300,
                backgroundColor: 'grey.50',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: column.color,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">{column.title}</Typography>
                <Box>
                  <IconButton size="small" sx={{ color: 'white' }} onClick={() => handleOpenColumnDialog(column)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'white' }} onClick={() => handleDeleteColumn(column.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Add Card Button */}
              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCardDialog(column.id)}
                  size="small"
                >
                  Adicionar Card
                </Button>
              </Box>

              {/* Cards List */}
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ p: 1, minHeight: 200, flexGrow: 1 }}
                  >
                    {getColumnCards(column.id).map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 1, cursor: 'grab' }}
                          >
                            <CardContent sx={{ pb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {card.title}
                                </Typography>
                                <Box>
                                  <IconButton size="small" onClick={() => handleOpenCardDialog(column.id, card)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteCard(card.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>

                              {card.description && (
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                  {card.description}
                                </Typography>
                              )}

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                <Chip
                                  label={card.priority}
                                  size="small"
                                  sx={{
                                    backgroundColor: PRIORITY_COLORS[card.priority as keyof typeof PRIORITY_COLORS],
                                    color: 'white',
                                  }}
                                />
                                {card.patient_name && (
                                  <Chip
                                    icon={<PersonIcon />}
                                    label={card.patient_name}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                                {card.appointment_date && (
                                  <Chip
                                    icon={<EventIcon />}
                                    label={format(parseISO(card.appointment_date), 'dd/MM/yyyy')}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>

                              {card.due_date && (
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                  Vencimento: {format(parseISO(card.due_date), 'dd/MM/yyyy')}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>

      {/* Column Dialog */}
      <Dialog open={columnDialogOpen} onClose={() => setColumnDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingColumn ? 'Editar Coluna' : 'Nova Coluna'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={8}>
              <TextField
                label="Título da Coluna"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Cor"
                type="color"
                value={columnColor}
                onChange={(e) => setColumnColor(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveColumn} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Card Dialog */}
      <Dialog open={cardDialogOpen} onClose={() => setCardDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingCard ? 'Editar Card' : 'Novo Card'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descriçéo"
                multiline
                rows={3}
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Prioridade"
                value={cardPriority}
                onChange={(e) => setCardPriority(e.target.value)}
                fullWidth
              >
                <MenuItem value="baixa">Baixa</MenuItem>
                <MenuItem value="media">Média</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Data de Vencimento"
                type="date"
                value={cardDueDate}
                onChange={(e) => setCardDueDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => option.name}
                value={selectedPatient}
                onChange={(_, newValue) => setSelectedPatient(newValue)}
                renderInput={(params) => <TextField {...params} label="Vincular a Paciente (opcional)" />}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={appointments.filter((apt) => !apt.is_evento)}
                getOptionLabel={(option) => 
                  `${option.patient_name} - ${format(parseISO(option.date_time), 'dd/MM/yyyy HH:mm')}`
                }
                value={selectedAppointment}
                onChange={(_, newValue) => setSelectedAppointment(newValue)}
                renderInput={(params) => <TextField {...params} label="Vincular a Agendamento (opcional)" />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveCard} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Kanban;
