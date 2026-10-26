// Monta o link do Google Agenda e o arquivo .ics a partir do CONVITE.

const compacto = (data, hora) => `${data.replace(/-/g, '')}T${hora.replace(':', '')}00`;

export function linkGoogleAgenda(c) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: c.titulo,
    dates: `${compacto(c.data, c.inicio)}/${compacto(c.data, c.fim)}`,
    ctz: c.fuso,
    details: c.detalhes,
  });
  if (c.local) params.set('location', c.local);
  return `https://calendar.google.com/calendar/render?${params}`;
}

function utc(c, hora) {
  return new Date(`${c.data}T${hora}:00${c.fusoUTC}`).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
}

const escapar = (s) => s.replace(/[\\;,]/g, (m) => `\\${m}`);

export function baixarIcs(c) {
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//a-ultima-honra//convite//PT',
    'BEGIN:VEVENT',
    `UID:convite-${c.data}@a-ultima-honra`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
    `DTSTART:${utc(c, c.inicio)}`,
    `DTEND:${utc(c, c.fim)}`,
    `SUMMARY:${escapar(c.titulo)}`,
    `DESCRIPTION:${escapar(c.detalhes)}`,
    c.local ? `LOCATION:${escapar(c.local)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const url = URL.createObjectURL(new Blob([linhas.join('\r\n')], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'convite-cafe.ics' });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
