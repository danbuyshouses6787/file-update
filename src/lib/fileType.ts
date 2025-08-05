export function getFileType(mime: string, name: string): 'csv' | 'xlsx' | 'unknown' {
  if (mime === 'text/csv') return 'csv';
  if (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return 'csv';
  if (ext === 'xlsx') return 'xlsx';
  return 'unknown';
}
