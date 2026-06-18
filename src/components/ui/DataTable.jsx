import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

/**
 * Reusable DataTable.
 *
 * columns: [{ key, header, render?(row), className?, align? }]
 * data:    array of row objects
 * onRowClick?(row) — makes rows clickable (cursor + gold hover)
 * Uses the shared `.admin-table` class for sticky header + hover styling.
 */
export default function DataTable({
  columns,
  data,
  onRowClick,
  rowKey = (r, i) => r.id ?? i,
  empty = 'Nothing to show.',
  className = '',
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/8 bg-ink-2 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.align === 'right' ? 'text-right' : ''} ${
                    col.headerClassName || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <motion.tr
                key={rowKey(row, i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.25) }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${col.align === 'right' ? 'text-right' : ''} ${
                      col.className || ''
                    }`}
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
          <Inbox className="text-white/20" size={36} />
          <p className="font-serif text-xl text-gold-light">{empty}</p>
          <p className="text-sm text-white/40">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
