// Helper to flatten nested objects
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
    return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? prefix + '_' : '';

        // Special handling for serviceItems array
        if (k === 'serviceItems' && Array.isArray(obj[k])) {
            const items = obj[k];
            const totalCost = items.reduce((sum: number, item: any) => sum + (item.cost || 0), 0);
            const itemsList = items.map((item: any) => `${item.service} (₹${item.cost})`).join('; ');
            acc[pre + 'serviceItems_count'] = items.length;
            acc[pre + 'serviceItems_total_cost'] = totalCost;
            acc[pre + 'serviceItems_details'] = itemsList;
        } else if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && !(obj[k] instanceof Date)) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else if (Array.isArray(obj[k])) {
            // For other arrays, convert to string
            acc[pre + k] = obj[k].join('; ');
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
    if (data.length === 0) return;

    // Flatten all rows
    const flattenedData = data.map(item => flattenObject(item));
    const headers = Object.keys(flattenedData[0]);

    const csvRows = [
        headers.join(','), // Header row
        ...flattenedData.map((row) =>
            headers
                .map((header) => {
                    const value = row[header] ?? '';
                    const stringValue = String(value);
                    // Escape quotes and wrap in quotes if contains comma
                    const escaped = stringValue.replace(/"/g, '""');
                    return escaped.includes(',') ? `"${escaped}"` : escaped;
                })
                .join(',')
        ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
