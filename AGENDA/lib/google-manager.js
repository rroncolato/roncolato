/**
 * Gerenciador de Google Calendar API
 * Funções para criar, atualizar, deletar eventos
 */

const { google } = require('googleapis');

class GoogleManager {
  constructor() {
    this.auth = this.getAuth();
    this.calendarId = process.env.GOOGLE_CALENDAR_ID;
  }

  getAuth() {
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');

    return new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: 'agenda-roncolato',
        private_key: privateKey,
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: '117573192736245228554',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }

  async getCalendarService() {
    return google.calendar({ version: 'v3', auth: this.auth });
  }

  // Buscar todos os eventos
  async getAllEvents(daysAhead = 30) {
    try {
      const calendar = await this.getCalendarService();
      const now = new Date();
      const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      const response = await calendar.events.list({
        calendarId: this.calendarId,
        timeMin: now.toISOString(),
        timeMax: future.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100,
      });

      return response.data.items || [];
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error.message);
      throw error;
    }
  }

  // Criar evento
  async createEvent(eventData) {
    try {
      const calendar = await this.getCalendarService();

      const event = {
        summary: eventData.name,
        description: eventData.description || eventData.name,
        start: {
          dateTime: new Date(eventData.date + 'T' + (eventData.time || '10:00')).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: new Date(
            new Date(eventData.date + 'T' + (eventData.time || '10:00')).getTime() + 60 * 60 * 1000
          ).toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        attendees: eventData.attendees || [],
        location: eventData.location || '',
      };

      // Adicionar link para Notion se fornecido
      if (eventData.notionUrl) {
        event.description = `${event.description}\n\n📌 Notion: ${eventData.notionUrl}`;
      }

      const response = await calendar.events.insert({
        calendarId: this.calendarId,
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar evento:', error.message);
      throw error;
    }
  }

  // Atualizar evento
  async updateEvent(eventId, eventData) {
    try {
      const calendar = await this.getCalendarService();

      const event = {
        summary: eventData.name,
        description: eventData.description || eventData.name,
      };

      if (eventData.date && eventData.time) {
        event.start = {
          dateTime: new Date(eventData.date + 'T' + eventData.time).toISOString(),
          timeZone: 'America/Sao_Paulo',
        };
        event.end = {
          dateTime: new Date(
            new Date(eventData.date + 'T' + eventData.time).getTime() + 60 * 60 * 1000
          ).toISOString(),
          timeZone: 'America/Sao_Paulo',
        };
      }

      if (eventData.notionUrl && !event.description.includes(eventData.notionUrl)) {
        event.description = `${event.description}\n\n📌 Notion: ${eventData.notionUrl}`;
      }

      const response = await calendar.events.update({
        calendarId: this.calendarId,
        eventId,
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar evento:', error.message);
      throw error;
    }
  }

  // Deletar evento
  async deleteEvent(eventId) {
    try {
      const calendar = await this.getCalendarService();

      await calendar.events.delete({
        calendarId: this.calendarId,
        eventId,
        sendUpdates: 'all',
      });

      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar evento:', error.message);
      throw error;
    }
  }

  // Extrair dados do evento
  extractEventData(event) {
    return {
      id: event.id,
      name: event.summary || 'Sem título',
      description: event.description || '',
      location: event.location || '',
      date: event.start.dateTime ? new Date(event.start.dateTime).toISOString().split('T')[0] : null,
      time: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null,
      attendees: event.attendees || [],
      calendarUrl: event.htmlLink,
      lastModified: new Date(event.updated),
    };
  }
}

module.exports = GoogleManager;
