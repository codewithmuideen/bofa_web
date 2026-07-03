export default function TransactionIcon({ icon, merchant }: { icon: string; merchant: string }) {
  const iconMap: Record<string, { bg: string; text: string; letter: string }> = {
    uber:       { bg: '#000000', text: '#fff', letter: 'U' },
    lyft:       { bg: '#FF00BF', text: '#fff', letter: 'L' },
    apple:      { bg: '#555555', text: '#fff', letter: 'A' },
    amazon:     { bg: '#FF9900', text: '#fff', letter: 'a' },
    starbucks:  { bg: '#00704A', text: '#fff', letter: 'S' },
    airbnb:     { bg: '#FF5A5F', text: '#fff', letter: 'A' },
    nike:       { bg: '#111111', text: '#fff', letter: 'N' },
    deposit:    { bg: '#1C3668', text: '#fff', letter: '+' },
    netflix:    { bg: '#E50914', text: '#fff', letter: 'N' },
    walmart:    { bg: '#0071CE', text: '#fff', letter: 'W' },
    bofa:       { bg: '#1C3668', text: '#fff', letter: 'B' },
    att:        { bg: '#00A8E0', text: '#fff', letter: '@' },
    spotify:    { bg: '#1DB954', text: '#fff', letter: 'S' },
    target:     { bg: '#CC0000', text: '#fff', letter: 'T' },
    wholefoods: { bg: '#00674B', text: '#fff', letter: 'W' },
    newbalance: { bg: '#CF0A2C', text: '#fff', letter: 'N' },
    dropbox:    { bg: '#0061FF', text: '#fff', letter: 'D' },
    gas:        { bg: '#F59E0B', text: '#fff', letter: 'G' },
  };

  const config = iconMap[icon] ?? { bg: '#6B7280', text: '#fff', letter: merchant[0]?.toUpperCase() ?? '?' };

  return (
    <div
      className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm"
      style={{ background: config.bg, color: config.text }}
    >
      {config.letter}
    </div>
  );
}
