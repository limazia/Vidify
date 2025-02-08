import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: Date | string): string {
  // Converte para Date se date for string (assumindo ISO format)
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj.valueOf())) {
    throw new Error('A data fornecida é inválida');
  }

  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000; // 1 dia em milissegundos
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / oneDayInMs);

  if (diffDays === 0) {
    return `Criado ${formatDistanceToNow(dateObj, { locale: ptBR, addSuffix: true })}`;
  } else if (diffDays === 1) {
    return 'Criado há 1 dia atrás';
  } else if (diffDays === 2) {
    return 'Criado há 2 dias atrás';
  } else {
    return `Criado em ${format(dateObj, 'dd/MM/yyyy', { locale: ptBR })}`;
  }
}
 