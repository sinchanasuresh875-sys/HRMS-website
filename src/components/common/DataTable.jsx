export default function DataTable({ columns = [], data = [], keyField = 'id', emptyState = null }) {
  if (!data || data.length === 0) {
    return emptyState || <div className="data-table-empty">No data available</div>;
  }

  return (
    <div className="table-responsive">
      <table className="custom-data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={col.headerClassName || ''}
                style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row[keyField] || rowIdx}>
              {columns.map((col, colIdx) => (
                <td
                  key={`${row[keyField] || rowIdx}-${col.key || colIdx}`}
                  className={col.cellClassName || ''}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render ? col.render(row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
