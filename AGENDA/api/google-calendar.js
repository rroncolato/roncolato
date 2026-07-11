const { google } = require('googleapis');

// Inicializar autenticação com Service Account + Domain-wide Delegation
function getAuthClient() {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
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

  return auth;
}

// Criar evento no Google Calendar
async function createCalendarEvent(eventData) {
  try {
    const auth = getAuthClient();

    // Impersonate o usuário usando setServiceAccountUser
    const client = await auth.getClient();
    client.subject = process.env.GOOGLE_CALENDAR_ID || 'rodrigo@rroncolato.com';

    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: eventData.name,
      description: eventData.message,
      start: {
        dateTime: new Date(eventData.date + 'T' + eventData.time).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(
          new Date(eventData.date + 'T' + eventData.time).getTime() + 60 * 60 * 1000
        ).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      organizer: {
        email: process.env.GOOGLE_CALENDAR_ID,
      },
      attendees: [
        { email: eventData.email, responseStatus: 'needsAction' },
        { email: process.env.GOOGLE_CALENDAR_ID, organizer: true, responseStatus: 'accepted' },
      ],
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: 'hangoutsMeet' },
          requestId: `${Date.now()}-${Math.random()}`,
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return {
      success: true,
      eventId: response.data.id,
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
    };
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error.message);
    throw error;
  }
}

module.exports = { getAuthClient, createCalendarEvent };
