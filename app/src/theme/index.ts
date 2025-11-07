// Tema customizado do sistema
export const theme = {
  colors: {
    // Cores principais
    primary: '#2BC7D4',
    primaryDark: '#1FA8B4',
    primaryLight: '#4DD4E0',
    
    // Cores de fundo
    background: {
      main: '#F5F7FA',
      secondary: '#FFFFFF',
      tertiary: '#F9FAFB',
      card: '#FFFFFF',
      hover: '#F3F4F6',
    },
    
    // Cores de texto
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      tertiary: '#718096',
      disabled: '#A0AEC0',
    },
    
    // Cores de status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Cores de borda
    border: {
      light: '#E2E8F0',
      medium: '#CBD5E0',
      dark: '#A0AEC0',
    },
    
    // Gradientes
    gradients: {
      primary: 'linear-gradient(135deg, #2BC7D4 0%, #16263F 100%)',
      secondary: 'linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
    },
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(43, 199, 212, 0.2)',
    glowHover: '0 0 30px rgba(43, 199, 212, 0.3)',
  },
  
  // Bordas arredondadas
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Transições
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Espaçamentos
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

export type Theme = typeof theme;
