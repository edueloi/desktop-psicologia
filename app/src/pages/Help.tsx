import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Help as HelpIcon,
  QuestionAnswer,
  Book,
  VideoLibrary,
  Article,
  ExpandMore,
  CheckCircle,
  Phone,
  Email,
  WhatsApp,
} from '@mui/icons-material';

const faqs = [
  {
    category: 'Geral',
    questions: [
      {
        q: 'Como faço para cadastrar um novo paciente?',
        a: 'Vá até a página "Pacientes" e clique no botéo "+ Novo Paciente". Preencha as informações básicas como nome, CPF, telefone e email. Você pode adicionar mais informações posteriormente.',
      },
      {
        q: 'Como agendar uma consulta?',
        a: 'Acesse a página "Agenda" e clique em um horário disponível no calendário. Selecione o paciente, defina a duraçéo (padréo 50min) e confirme o agendamento.',
      },
      {
        q: 'Posso cancelar ou reagendar uma consulta?',
        a: 'Sim! Na agenda, clique na consulta agendada e escolha "Reagendar" ou "Cancelar". O sistema permite até 2 horas antes do horário marcado.',
      },
    ],
  },
  {
    category: 'Kanban',
    questions: [
      {
        q: 'Para que serve o Kanban?',
        a: 'O Kanban ajuda você a organizar tarefas, processos de acompanhamento de pacientes e fluxos de trabalho. Você pode criar quadros personalizados e mover cards entre colunas.',
      },
      {
        q: 'Como criar um novo quadro Kanban?',
        a: 'Na página Kanban, clique em "+ Novo Quadro", dê um nome descritivo e escolha uma cor. O sistema criará 3 colunas padréo: A Fazer, Em Progresso e Concluído.',
      },
      {
        q: 'Posso ter múltiplos quadros?',
        a: 'Sim! Você pode criar quantos quadros precisar. Por exemplo: um para pacientes novos, outro para follow-ups, outro para tarefas administrativas.',
      },
    ],
  },
  {
    category: 'Faturamento',
    questions: [
      {
        q: 'Como registro um pagamento?',
        a: 'Na página "Faturamento", clique em "+ Novo Pagamento", selecione o paciente, informe o valor e a forma de pagamento. O sistema vincula automaticamente à consulta.',
      },
      {
        q: 'Como gerar recibos?',
        a: 'Após registrar o pagamento, clique em "Gerar Recibo". O sistema cria um PDF com seus dados profissionais e as informações do pagamento.',
      },
      {
        q: 'Posso ver um resumo financeiro mensal?',
        a: 'Sim! Na página Faturamento há cards com estatísticas do mês: total recebido, pagamentos pendentes e projeçéo mensal.',
      },
    ],
  },
  {
    category: 'Segurança',
    questions: [
      {
        q: 'Meus dados estéo seguros?',
        a: 'Sim! Todos os dados séo armazenados localmente no seu computador usando SQLite. Nenhuma informaçéo é enviada para servidores externos.',
      },
      {
        q: 'Como faço backup dos dados?',
        a: 'Vá em Configurações > Backup e clique em "Criar Backup". O sistema exporta um arquivo que pode ser salvo em nuvem ou pen drive.',
      },
      {
        q: 'Posso acessar de outro computador?',
        a: 'Como é um sistema desktop, você precisa instalar em cada computador. Use o backup para transferir os dados entre máquinas.',
      },
    ],
  },
];

const resources = [
  {
    icon: <Book />,
    title: 'Documentaçéo Completa',
    description: 'Guia detalhado de todas as funcionalidades',
    color: '#3B82F6',
  },
  {
    icon: <VideoLibrary />,
    title: 'Vídeos Tutoriais',
    description: 'Aprenda visualmente como usar o sistema',
    color: '#8B5CF6',
  },
  {
    icon: <Article />,
    title: 'Blog de Dicas',
    description: 'Artigos sobre gestéo de consultório',
    color: '#10B981',
  },
  {
    icon: <QuestionAnswer />,
    title: 'Comunidade',
    description: 'Tire dúvidas com outros usuários',
    color: '#F59E0B',
  },
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #2BC7D4 0%, #16263F 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HelpIcon sx={{ color: '#FFFFFF', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A202C' }}>
            Central de Ajuda
          </Typography>
          <Typography variant="body2" sx={{ color: '#718096' }}>
            Encontre respostas e aprenda a usar o PsychDesk Pro
          </Typography>
        </Box>
      </Box>

      {/* Busca */}
      <TextField
        fullWidth
        placeholder="Buscar dúvidas frequentes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#718096' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            background: '#FFFFFF',
            borderRadius: 2,
          },
        }}
      />

      {/* Recursos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {resources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #E2E8F0',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: resource.color,
                    mb: 2,
                  }}
                >
                  {resource.icon}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A202C', mb: 1 }}>
                  {resource.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096' }}>
                  {resource.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FAQ */}
      <Card sx={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C', mb: 3 }}>
            Perguntas Frequentes
          </Typography>

          {filteredFaqs.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 64, color: '#CBD5E0', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#718096' }}>
                Nenhuma resposta encontrada
              </Typography>
              <Typography variant="body2" sx={{ color: '#A0AEC0', mt: 1 }}>
                Tente buscar com outros termos
              </Typography>
            </Box>
          ) : (
            filteredFaqs.map((category, catIndex) => (
              <Box key={catIndex} sx={{ mb: 4 }}>
                <Chip
                  label={category.category}
                  sx={{
                    mb: 2,
                    background: '#2BC7D4',
                    color: '#FFFFFF',
                    fontWeight: 600,
                  }}
                />
                {category.questions.map((faq, faqIndex) => (
                  <Accordion
                    key={faqIndex}
                    expanded={expanded === `${catIndex}-${faqIndex}`}
                    onChange={handleAccordionChange(`${catIndex}-${faqIndex}`)}
                    sx={{
                      mb: 1,
                      border: '1px solid #E2E8F0',
                      '&:before': { display: 'none' },
                      boxShadow: 'none',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        '&:hover': {
                          background: 'rgba(43, 199, 212, 0.05)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 600, color: '#1A202C' }}>
                          {faq.q}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: '#4A5568', lineHeight: 1.7 }}>
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Contato */}
      <Card sx={{ mt: 4, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A202C', mb: 2 }}>
            Ainda precisa de ajuda?
          </Typography>
          <Typography variant="body1" sx={{ color: '#718096', mb: 3 }}>
            Nossa equipe está pronta para ajudar você!
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Email sx={{ color: '#2BC7D4' }} />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary="suporte@psychdeskpro.com"
                primaryTypographyProps={{ fontWeight: 600, color: '#1A202C' }}
                secondaryTypographyProps={{ color: '#718096' }}
              />
              <Button variant="outlined" size="small">
                Enviar
              </Button>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WhatsApp sx={{ color: '#10B981' }} />
              </ListItemIcon>
              <ListItemText
                primary="WhatsApp"
                secondary="(11) 98765-4321"
                primaryTypographyProps={{ fontWeight: 600, color: '#1A202C' }}
                secondaryTypographyProps={{ color: '#718096' }}
              />
              <Button variant="outlined" size="small" sx={{ borderColor: '#10B981', color: '#10B981' }}>
                Chat
              </Button>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone sx={{ color: '#F59E0B' }} />
              </ListItemIcon>
              <ListItemText
                primary="Telefone"
                secondary="(11) 3456-7890"
                primaryTypographyProps={{ fontWeight: 600, color: '#1A202C' }}
                secondaryTypographyProps={{ color: '#718096' }}
              />
              <Button variant="outlined" size="small" sx={{ borderColor: '#F59E0B', color: '#F59E0B' }}>
                Ligar
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
