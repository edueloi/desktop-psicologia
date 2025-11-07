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
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Tooltip,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../services/api';

const PRIORITY_COLORS = {
  baixa: '#10B981',
  media: '#F59E0B',
  alta: '#EF4444',
};

interface Board {
  id: string;
  name: string;
  description: string;
  color: string;
  favorite: boolean;
}

interface Column {
  id: string;
  board_id: string;
  title: string;
  color: string;
  position: number;
}

interface Card {
  id: string;
  column_id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  due_date?: string;
  patient_id?: string;
  position: number;
}

function KanbanBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  
  // Dialogs
  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [boardMenuAnchor, setBoardMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Form states - Board
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardColor, setBoardColor] = useState('#2BC7D4');
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  
  // Form states - Column
  const [columnTitle, setColumnTitle] = useState('');
  const [columnColor, setColumnColor] = useState('#2BC7D4');
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  
  // Form states - Card
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardPriority, setCardPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [cardDueDate, setCardDueDate] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (currentBoard) {
      loadBoardData(currentBoard.id);
    }
  }, [currentBoard]);

  const loadBoards = async () => {
    try {
      // Simulando dados - vocÃª precisarÃ¡ criar as rotas no backend
      const mockBoards: Board[] = [
        { id: '1', name: 'Atendimentos', description: 'GestÃ£o de pacientes', color: '#2BC7D4', favorite: true },
        { id: '2', name: 'Projetos', description: 'Projetos de pesquisa', color: '#8B5CF6', favorite: false },
        { id: '3', name: 'Tarefas Pessoais', description: 'OrganizaÃ§Ã£o pessoal', color: '#F59E0B', favorite: false },
      ];
      setBoards(mockBoards);
      if (mockBoards.length > 0 && !currentBoard) {
        setCurrentBoard(mockBoards[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar boards:', error);
    }
  };

  const loadBoardData = async (boardId: string) => {
    try {
      const [columnsRes, cardsRes] = await Promise.all([
        api.get(`/kanban/columns?board_id=${boardId}`),
        api.get(`/kanban/cards?board_id=${boardId}`),
      ]);
      
      setColumns(columnsRes.data.sort((a: Column, b: Column) => a.position - b.position));
      setCards(cardsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados do board:', error);
      // Mock data para demonstraÃ§Ã£o
      const mockColumns: Column[] = [
        { id: '1', board_id: boardId, title: 'A Fazer', color: '#3B82F6', position: 0 },
        { id: '2', board_id: boardId, title: 'Em Progresso', color: '#F59E0B', position: 1 },
        { id: '3', board_id: boardId, title: 'ConcluÃ­do', color: '#10B981', position: 2 },
      ];
      const mockCards: Card[] = [
        { id: '1', column_id: '1', title: 'Revisar prontuÃ¡rios', description: 'Revisar prontuÃ¡rios da semana', priority: 'alta', position: 0 },
        { id: '2', column_id: '1', title: 'Agendar supervisÃ£o', description: 'Marcar supervisÃ£o mensal', priority: 'media', position: 1 },
        { id: '3', column_id: '2', title: 'Estudar novo protocolo', description: 'Protocolo TCC', priority: 'media', position: 0 },
        { id: '4', column_id: '3', title: 'RelatÃ³rio mensal', description: 'RelatÃ³rio completo', priority: 'baixa', position: 0 },
      ];
      setColumns(mockColumns);
      setCards(mockCards);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
      const card = cards.find((c) => c.id === draggableId);
      if (!card) return;

      const updatedCard = { ...card, column_id: destination.droppableId };
      
      try {
        await api.put(`/kanban/cards/${draggableId}`, { column_id: destination.droppableId });
        setCards((prev) =>
          prev.map((c) => (c.id === draggableId ? updatedCard : c))
        );
      } catch (error) {
        console.error('Erro ao mover card:', error);
        setCards((prev) =>
          prev.map((c) => (c.id === draggableId ? updatedCard : c))
        );
      }
    }
  };

  const openBoardDialog = (board?: Board) => {
    if (board) {
      setEditingBoard(board);
      setBoardName(board.name);
      setBoardDescription(board.description);
      setBoardColor(board.color);
    } else {
      setEditingBoard(null);
      setBoardName('');
      setBoardDescription('');
      setBoardColor('#2BC7D4');
    }
    setBoardDialogOpen(true);
  };

  const saveBoardHandler = () => {
    if (editingBoard) {
      // Atualizar board existente
      const updatedBoards = boards.map(b => 
        b.id === editingBoard.id 
          ? { ...b, name: boardName, description: boardDescription, color: boardColor }
          : b
      );
      setBoards(updatedBoards);
      if (currentBoard?.id === editingBoard.id) {
        setCurrentBoard({ ...editingBoard, name: boardName, description: boardDescription, color: boardColor });
      }
    } else {
      // Criar novo board
      const newBoard: Board = {
        id: Date.now().toString(),
        name: boardName,
        description: boardDescription,
        color: boardColor,
        favorite: false,
      };
      setBoards([...boards, newBoard]);
    }
    setBoardDialogOpen(false);
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter(b => b.id !== boardId));
    if (currentBoard?.id === boardId && boards.length > 1) {
      setCurrentBoard(boards.find(b => b.id !== boardId) || null);
    }
  };

  const toggleFavorite = (boardId: string) => {
    setBoards(boards.map(b => 
      b.id === boardId ? { ...b, favorite: !b.favorite } : b
    ));
  };

  const openColumnDialog = (column?: Column) => {
    if (column) {
      setEditingColumn(column);
      setColumnTitle(column.title);
      setColumnColor(column.color);
    } else {
      setEditingColumn(null);
      setColumnTitle('');
      setColumnColor('#2BC7D4');
    }
    setColumnDialogOpen(true);
  };

  const saveColumnHandler = async () => {
    if (!currentBoard) return;

    if (editingColumn) {
      try {
        await api.put(`/kanban/columns/${editingColumn.id}`, {
          title: columnTitle,
          color: columnColor,
        });
        setColumns(columns.map(c => 
          c.id === editingColumn.id ? { ...c, title: columnTitle, color: columnColor } : c
        ));
      } catch (error) {
        setColumns(columns.map(c => 
          c.id === editingColumn.id ? { ...c, title: columnTitle, color: columnColor } : c
        ));
      }
    } else {
      const newColumn: Column = {
        id: Date.now().toString(),
        board_id: currentBoard.id,
        title: columnTitle,
        color: columnColor,
        position: columns.length,
      };
      try {
        const response = await api.post('/kanban/columns', newColumn);
        setColumns([...columns, response.data]);
      } catch (error) {
        setColumns([...columns, newColumn]);
      }
    }
    setColumnDialogOpen(false);
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await api.delete(`/kanban/columns/${columnId}`);
      setColumns(columns.filter(c => c.id !== columnId));
      setCards(cards.filter(c => c.column_id !== columnId));
    } catch (error) {
      setColumns(columns.filter(c => c.id !== columnId));
      setCards(cards.filter(c => c.column_id !== columnId));
    }
  };

  const openCardDialog = (column: Column, card?: Card) => {
    setSelectedColumn(column);
    if (card) {
      setEditingCard(card);
      setCardTitle(card.title);
      setCardDescription(card.description);
      setCardPriority(card.priority);
      setCardDueDate(card.due_date || '');
    } else {
      setEditingCard(null);
      setCardTitle('');
      setCardDescription('');
      setCardPriority('media');
      setCardDueDate('');
    }
    setCardDialogOpen(true);
  };

  const saveCardHandler = async () => {
    if (!selectedColumn) return;

    if (editingCard) {
      const updatedCard = {
        ...editingCard,
        title: cardTitle,
        description: cardDescription,
        priority: cardPriority,
        due_date: cardDueDate,
      };
      try {
        await api.put(`/kanban/cards/${editingCard.id}`, updatedCard);
        setCards(cards.map(c => c.id === editingCard.id ? updatedCard : c));
      } catch (error) {
        setCards(cards.map(c => c.id === editingCard.id ? updatedCard : c));
      }
    } else {
      const newCard: Card = {
        id: Date.now().toString(),
        column_id: selectedColumn.id,
        title: cardTitle,
        description: cardDescription,
        priority: cardPriority,
        due_date: cardDueDate,
        position: cards.filter(c => c.column_id === selectedColumn.id).length,
      };
      try {
        const response = await api.post('/kanban/cards', newCard);
        setCards([...cards, response.data]);
      } catch (error) {
        setCards([...cards, newCard]);
      }
    }
    setCardDialogOpen(false);
  };

  const deleteCard = async (cardId: string) => {
    try {
      await api.delete(`/kanban/cards/${cardId}`);
      setCards(cards.filter(c => c.id !== cardId));
    } catch (error) {
      setCards(cards.filter(c => c.id !== cardId));
    }
  };

  return (
    <Box>
      {/* Header com Boards */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A202C' }}>
            Quadros Kanban
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openBoardDialog()}
            sx={{
              background: 'linear-gradient(135deg, #2BC7D4 0%, #FFFFFF 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1FA8B4 0%, #F5F7FA 100%)',
              },
            }}
          >
            Novo Quadro
          </Button>
        </Box>

        {/* Tabs com Boards */}
        <Paper sx={{ background: '#FFFFFF', borderRadius: 2, p: 2, border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {boards.map((board) => (
              <Card
                key={board.id}
                onClick={() => setCurrentBoard(board)}
                sx={{
                  minWidth: 200,
                  cursor: 'pointer',
                  background: currentBoard?.id === board.id 
                    ? `linear-gradient(135deg, ${board.color}33 0%, ${board.color}11 100%)`
                    : '#FFFFFF',
                  border: currentBoard?.id === board.id ? `2px solid ${board.color}` : '1px solid #E2E8F0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 16px ${board.color}44`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: board.color }}>
                        <DashboardIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(board.id);
                        }}
                      >
                        {board.favorite ? (
                          <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                        ) : (
                          <StarBorderIcon sx={{ color: '#8A92A0', fontSize: 18 }} />
                        )}
                      </IconButton>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardMenuAnchor(e.currentTarget);
                        setEditingBoard(board);
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#1A202C', fontWeight: 600 }}>
                    {board.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8A92A0' }}>
                    {board.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* Menu do Board */}
        <Menu
          anchorEl={boardMenuAnchor}
          open={Boolean(boardMenuAnchor)}
          onClose={() => setBoardMenuAnchor(null)}
          PaperProps={{
            sx: { background: '#FFFFFF', border: '1px solid #E2E8F0' },
          }}
        >
          <MenuItem
            onClick={() => {
              setBoardMenuAnchor(null);
              if (editingBoard) openBoardDialog(editingBoard);
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setBoardMenuAnchor(null);
              if (editingBoard) deleteBoard(editingBoard.id);
            }}
            sx={{ color: '#EF4444' }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Excluir
          </MenuItem>
        </Menu>
      </Box>

      {/* Kanban Board */}
      {currentBoard && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: '#1A202C', fontWeight: 600 }}>
              {currentBoard.name}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openColumnDialog()}
              sx={{
                borderColor: '#2BC7D4',
                color: '#2BC7D4',
                '&:hover': {
                  borderColor: '#2BC7D4',
                  background: 'rgba(43, 199, 212, 0.1)',
                },
              }}
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
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      background: `linear-gradient(135deg, ${column.color}33 0%, ${column.color}11 100%)`,
                      borderBottom: `3px solid ${column.color}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#1A202C', fontWeight: 600 }}>
                      {column.title}
                      <Chip
                        label={cards.filter(c => c.column_id === column.id).length}
                        size="small"
                        sx={{ ml: 1, background: column.color, color: '#1A202C' }}
                      />
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => openCardDialog(column)}
                        sx={{ color: '#2BC7D4' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => openColumnDialog(column)}
                        sx={{ color: '#8A92A0' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteColumn(column.id)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          p: 2,
                          minHeight: 400,
                          maxHeight: 600,
                          overflowY: 'auto',
                          background: snapshot.isDraggingOver ? 'rgba(43, 199, 212, 0.05)' : 'transparent',
                        }}
                      >
                        {cards
                          .filter((card) => card.column_id === column.id)
                          .sort((a, b) => a.position - b.position)
                          .map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    mb: 2,
                                    background: snapshot.isDragging ? '#253854' : '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    cursor: 'grab',
                                    '&:hover': {
                                      borderColor: '#2BC7D4',
                                      boxShadow: '0 4px 12px rgba(43, 199, 212, 0.2)',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Chip
                                        label={card.priority}
                                        size="small"
                                        sx={{
                                          background: PRIORITY_COLORS[card.priority],
                                          color: '#1A202C',
                                          fontWeight: 600,
                                          fontSize: '0.7rem',
                                        }}
                                      />
                                      <Box>
                                        <IconButton
                                          size="small"
                                          onClick={() => openCardDialog(column, card)}
                                          sx={{ color: '#8A92A0', p: 0.5 }}
                                        >
                                          <EditIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => deleteCard(card.id)}
                                          sx={{ color: '#EF4444', p: 0.5 }}
                                        >
                                          <DeleteIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ color: '#1A202C', fontWeight: 600, mb: 1 }}>
                                      {card.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#8A92A0', display: 'block', mb: 1 }}>
                                      {card.description}
                                    </Typography>
                                    {card.due_date && (
                                      <Typography variant="caption" sx={{ color: '#F59E0B' }}>
                                        ðŸ“… {new Date(card.due_date).toLocaleDateString('pt-BR')}
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
        </Box>
      )}

      {/* Dialog - Novo/Editar Board */}
      <Dialog 
        open={boardDialogOpen} 
        onClose={() => setBoardDialogOpen(false)}
        PaperProps={{
          sx: { background: '#FFFFFF', border: '1px solid #E2E8F0', minWidth: 500 },
        }}
      >
        <DialogTitle sx={{ color: '#1A202C' }}>
          {editingBoard ? 'Editar Quadro' : 'Novo Quadro'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome do Quadro"
              fullWidth
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              sx={{ input: { color: '#1A202C' } }}
            />
            <TextField
              label="DescriÃ§Ã£o"
              fullWidth
              multiline
              rows={2}
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              sx={{ input: { color: '#1A202C' } }}
            />
            <TextField
              label="Cor"
              type="color"
              fullWidth
              value={boardColor}
              onChange={(e) => setBoardColor(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBoardDialogOpen(false)} sx={{ color: '#8A92A0' }}>
            Cancelar
          </Button>
          <Button onClick={saveBoardHandler} variant="contained" sx={{ background: '#2BC7D4' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Nova/Editar Coluna */}
      <Dialog 
        open={columnDialogOpen} 
        onClose={() => setColumnDialogOpen(false)}
        PaperProps={{
          sx: { background: '#FFFFFF', border: '1px solid #E2E8F0' },
        }}
      >
        <DialogTitle sx={{ color: '#1A202C' }}>
          {editingColumn ? 'Editar Coluna' : 'Nova Coluna'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="TÃ­tulo"
              fullWidth
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              sx={{ input: { color: '#1A202C' } }}
            />
            <TextField
              label="Cor"
              type="color"
              fullWidth
              value={columnColor}
              onChange={(e) => setColumnColor(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnDialogOpen(false)} sx={{ color: '#8A92A0' }}>
            Cancelar
          </Button>
          <Button onClick={saveColumnHandler} variant="contained" sx={{ background: '#2BC7D4' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Novo/Editar Card */}
      <Dialog 
        open={cardDialogOpen} 
        onClose={() => setCardDialogOpen(false)}
        PaperProps={{
          sx: { background: '#FFFFFF', border: '1px solid #E2E8F0', minWidth: 500 },
        }}
      >
        <DialogTitle sx={{ color: '#1A202C' }}>
          {editingCard ? 'Editar Card' : 'Novo Card'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="TÃ­tulo"
              fullWidth
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              sx={{ input: { color: '#1A202C' } }}
            />
            <TextField
              label="DescriÃ§Ã£o"
              fullWidth
              multiline
              rows={3}
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              sx={{ input: { color: '#1A202C' } }}
            />
            <TextField
              label="Prioridade"
              select
              fullWidth
              value={cardPriority}
              onChange={(e) => setCardPriority(e.target.value as 'baixa' | 'media' | 'alta')}
              sx={{ input: { color: '#1A202C' } }}
            >
              <MenuItem value="baixa">Baixa</MenuItem>
              <MenuItem value="media">MÃ©dia</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </TextField>
            <TextField
              label="Data de Vencimento"
              type="date"
              fullWidth
              value={cardDueDate}
              onChange={(e) => setCardDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ input: { color: '#1A202C' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardDialogOpen(false)} sx={{ color: '#8A92A0' }}>
            Cancelar
          </Button>
          <Button onClick={saveCardHandler} variant="contained" sx={{ background: '#2BC7D4' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default KanbanBoards;

