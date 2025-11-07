/**
 * Seed para popular tabelas de notificações e settings
 */

exports.seed = async function(knex) {
  // Limpar tabelas
  await knex('notifications').del();
  await knex('user_settings').del();

  const userId = 1; // ID do usuário admin

  // Inserir configurações padrão
  await knex('user_settings').insert({
    user_id: userId,
    appointment_duration: 50,
    appointment_interval: 10,
    work_start_time: '08:00',
    work_end_time: '18:00',
    work_days: JSON.stringify([1, 2, 3, 4, 5]), // Segunda a sexta
    notification_email: true,
    notification_sms: false,
    notification_whatsapp: true,
    reminder_hours_before: 24,
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    theme: 'light',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Inserir notificações de exemplo
  const notifications = [
    {
      user_id: userId,
      title: 'Bem-vindo ao PsychDesk!',
      message: 'Seja bem-vindo ao sistema de gestão para psicólogos. Configure seu perfil e comece a agendar consultas.',
      type: 'success',
      priority: 'high',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      user_id: userId,
      title: 'Consulta Agendada',
      message: 'Nova consulta agendada para hoje às 14:00',
      type: 'info',
      priority: 'normal',
      related_type: 'appointment',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
    },
    {
      user_id: userId,
      title: 'Lembrete de Consulta',
      message: 'Você tem uma consulta agendada para amanhã às 10:00 com Maria Silva',
      type: 'warning',
      priority: 'high',
      related_type: 'appointment',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hora atrás
    },
    {
      user_id: userId,
      title: 'Pagamento Recebido',
      message: 'Pagamento de R$ 150,00 recebido do paciente João Santos',
      type: 'success',
      priority: 'normal',
      related_type: 'appointment',
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 horas atrás
    }
  ];

  await knex('notifications').insert(notifications);

  console.log('✓ Configurações e notificações criadas');
};
