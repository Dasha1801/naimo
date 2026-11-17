export function formatSalary(
  min?: number,
  max?: number,
  currency = 'USD',
  period?: string,
): string | null {
  if (!min && !max) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  const range =
    min && max ? `${fmt(min)} – ${fmt(max)}` : min ? `от ${fmt(min)}` : `до ${fmt(max!)}`;

  const suffix =
    period === 'yearly'
      ? ' / год'
      : period === 'monthly'
        ? ' / мес'
        : period === 'hourly'
          ? ' / час'
          : '';

  return `${range}${suffix}`;
}
