export function dayOfWeek(date: Date) {
  const first = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  const last = first + 6;

  const firstDay = new Date(date);
  firstDay.setDate(first);

  const lastDay = new Date(date);
  lastDay.setDate(last);

  return { firstDay, lastDay };
}

export function dayOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { firstDay, lastDay };
}
