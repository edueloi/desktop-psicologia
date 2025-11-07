import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person,
  CalendarMonth,
  AttachMoney,
  Description,
  Close,
  FilterList,
  TrendingUp,
  History,
} from "@mui/icons-material";

interface SearchResult {
  id: number;
  type: "patient" | "appointment" | "payment" | "note";
  title: string;
  subtitle: string;
  details: string;
  date: string;
  status?: string;
  avatar?: string;
}

const mockResults: SearchResult[] = [
  {
    id: 1,
    type: "patient",
    title: "Maria Silva",
    subtitle: "CPF: 123.456.789-00",
    details: "Paciente desde 2023 • 15 consultas realizadas",
    date: "Última consulta: 15/01/2025",
    status: "Ativo",
  },
  {
    id: 2,
    type: "appointment",
    title: "Consulta com Joéo Santos",
    subtitle: "Sesséo de terapia individual",
    details: "Duraçéo: 50 minutos",
    date: "16/01/2025 às 14:00",
    status: "Confirmada",
  },
  {
    id: 3,
    type: "payment",
    title: "Pagamento recebido",
    subtitle: "Ana Costa - Sesséo 10/01",
    details: "Forma de pagamento: PIX",
    date: "10/01/2025",
    status: "R$ 200,00",
  },
  {
    id: 4,
    type: "note",
    title: "Anotaçéo: Pedro Oliveira",
    subtitle: "Evoluçéo clínica",
    details: "Paciente apresentou melhora significativa no quadro de ansiedade...",
    date: "12/01/2025",
  },
  {
    id: 5,
    type: "patient",
    title: "Carlos Ferreira",
    subtitle: "CPF: 987.654.321-00",
    details: "Paciente desde 2024 • 8 consultas realizadas",
    date: "Última consulta: 08/01/2025",
    status: "Ativo",
  },
];

const recentSearches = [
  "Maria Silva",
  "Consultas de janeiro",
  "Pagamentos pendentes",
  "Relatório mensal",
];

const getTypeIcon = (type: string) => {
  const icons = {
    patient: <Person />,
    appointment: <CalendarMonth />,
    payment: <AttachMoney />,
    note: <Description />,
  };
  return icons[type as keyof typeof icons] || <SearchIcon />;
};

const getTypeColor = (type: string) => {
  const colors = {
    patient: "#3B82F6",
    appointment: "#F59E0B",
    payment: "#10B981",
    note: "#8B5CF6",
  };
  return colors[type as keyof typeof colors] || "#718096";
};

const getTypeLabel = (type: string) => {
  const labels = {
    patient: "Paciente",
    appointment: "Consulta",
    payment: "Pagamento",
    note: "Anotaçéo",
  };
  return labels[type as keyof typeof labels] || type;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      setIsSearching(true);
      // Simular busca
      setTimeout(() => {
        setResults(mockResults.filter(r => 
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredResults = results.filter(r => {
    if (tabValue === 0) return true; // Todos
    if (tabValue === 1) return r.type === "patient";
    if (tabValue === 2) return r.type === "appointment";
    if (tabValue === 3) return r.type === "payment";
    if (tabValue === 4) return r.type === "note";
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(135deg, #2BC7D4 0%, #16263F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1A202C" }}>
              Busca Inteligente
            </Typography>
            <Typography variant="body2" sx={{ color: "#718096" }}>
              Encontre pacientes, consultas, pagamentos e anotações
            </Typography>
          </Box>
        </Box>

        {/* Campo de Busca */}
        <TextField
          fullWidth
          placeholder="Buscar pacientes, consultas, pagamentos, anotações..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#718096" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSearch("")}
                  sx={{ color: "#718096" }}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: "#FFFFFF",
              borderRadius: 3,
              fontSize: "1.1rem",
              "& fieldset": {
                borderWidth: 2,
              },
            },
          }}
        />

        {/* Dica de atalho */}
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "#A0AEC0" }}>
            Dica: Use
          </Typography>
          <Chip
            label="Ctrl + K"
            size="small"
            sx={{
              background: "#E2E8F0",
              color: "#4A5568",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
          <Typography variant="caption" sx={{ color: "#A0AEC0" }}>
            para busca rápida
          </Typography>
        </Box>
      </Box>

      {/* Conteúdo */}
      {!searchQuery ? (
        // Buscas recentes e sugestões
        <Box sx={{ display: "flex", gap: 3 }}>
          <Card
            sx={{
              flex: 1,
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <History sx={{ color: "#718096" }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1A202C" }}>
                  Buscas Recentes
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {recentSearches.map((search, index) => (
                  <Box key={index}>
                    <ListItem
                      button
                      onClick={() => handleSearch(search)}
                      sx={{
                        borderRadius: 1,
                        "&:hover": { background: "rgba(43, 199, 212, 0.05)" },
                      }}
                    >
                      <ListItemText
                        primary={search}
                        sx={{ "& .MuiListItemText-primary": { color: "#4A5568" } }}
                      />
                      <SearchIcon sx={{ color: "#CBD5E0" }} />
                    </ListItem>
                    {index < recentSearches.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TrendingUp sx={{ color: "#718096" }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1A202C" }}>
                  Buscar por
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Person />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    "&:hover": {
                      borderColor: "#2BC7D4",
                      background: "rgba(43, 199, 212, 0.05)",
                    },
                  }}
                >
                  Pacientes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    "&:hover": {
                      borderColor: "#2BC7D4",
                      background: "rgba(43, 199, 212, 0.05)",
                    },
                  }}
                >
                  Consultas
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AttachMoney />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    "&:hover": {
                      borderColor: "#2BC7D4",
                      background: "rgba(43, 199, 212, 0.05)",
                    },
                  }}
                >
                  Pagamentos
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    borderColor: "#E2E8F0",
                    color: "#4A5568",
                    "&:hover": {
                      borderColor: "#2BC7D4",
                      background: "rgba(43, 199, 212, 0.05)",
                    },
                  }}
                >
                  Anotações
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        // Resultados da busca
        <Box>
          {/* Estatísticas */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "#718096" }}>
              {isSearching
                ? "Buscando..."
                : `${filteredResults.length} resultado${filteredResults.length !== 1 ? "s" : ""} encontrado${filteredResults.length !== 1 ? "s" : ""}`}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              size="small"
              sx={{
                borderColor: "#E2E8F0",
                color: "#4A5568",
                "&:hover": {
                  borderColor: "#2BC7D4",
                  background: "rgba(43, 199, 212, 0.05)",
                },
              }}
            >
              Filtros
            </Button>
          </Box>

          {/* Tabs */}
          <Card
            sx={{
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: "1px solid #E2E8F0",
                "& .MuiTab-root": {
                  color: "#718096",
                  fontWeight: 600,
                },
                "& .Mui-selected": {
                  color: "#2BC7D4",
                },
              }}
            >
              <Tab label={`Todos (${results.length})`} />
              <Tab label={`Pacientes (${results.filter(r => r.type === "patient").length})`} />
              <Tab label={`Consultas (${results.filter(r => r.type === "appointment").length})`} />
              <Tab label={`Pagamentos (${results.filter(r => r.type === "payment").length})`} />
              <Tab label={`Anotações (${results.filter(r => r.type === "note").length})`} />
            </Tabs>

            <List sx={{ p: 0 }}>
              {filteredResults.length === 0 ? (
                <Box sx={{ p: 6, textAlign: "center" }}>
                  <SearchIcon sx={{ fontSize: 64, color: "#CBD5E0", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#718096" }}>
                    Nenhum resultado encontrado
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#A0AEC0", mt: 1 }}>
                    Tente buscar com outros termos
                  </Typography>
                </Box>
              ) : (
                filteredResults.map((result, index) => (
                  <Box key={result.id}>
                    <ListItem
                      button
                      sx={{
                        py: 2.5,
                        px: 3,
                        "&:hover": { background: "rgba(43, 199, 212, 0.05)" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            background: getTypeColor(result.type),
                            width: 48,
                            height: 48,
                          }}
                        >
                          {getTypeIcon(result.type)}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1A202C" }}>
                              {result.title}
                            </Typography>
                            <Chip
                              label={getTypeLabel(result.type)}
                              size="small"
                              sx={{
                                background: `${getTypeColor(result.type)}22`,
                                color: getTypeColor(result.type),
                                fontWeight: 600,
                                fontSize: "0.7rem",
                              }}
                            />
                            {result.status && (
                              <Chip
                                label={result.status}
                                size="small"
                                sx={{
                                  background: "#10B98122",
                                  color: "#10B981",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: "#4A5568", mb: 0.5 }}>
                              {result.subtitle}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#718096", mb: 0.5 }}>
                              {result.details}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#A0AEC0" }}>
                              {result.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredResults.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </List>
          </Card>
        </Box>
      )}
    </Box>
  );
}
