

 const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, { bg: string; text: string; fill: string }> = {
    AVAILABLE: { bg: 'bg-green-100', text: 'text-green-600', fill: 'fill-green-400' },
    OCCUPIED: { bg: 'bg-blue-100', text: 'text-blue-600', fill: 'fill-blue-400' },
    RESERVED: { bg: 'bg-yellow-100', text: 'text-yellow-600', fill: 'fill-yellow-400' },
    MAINTENANCE: { bg: 'bg-red-100', text: 'text-red-600', fill: 'fill-red-400' },
  };

  const style = statusStyles[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    fill: 'fill-gray-400',
  };

  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-md ${style.bg} px-2 py-1 text-xs font-medium ${style.text}`}>
      <svg viewBox="0 0 6 6" aria-hidden="true" className={`size-1.5 ${style.fill}`}>
        <circle r={3} cx={3} cy={3} />
      </svg>
      {status}
    </span>
  );
};

export default StatusBadge