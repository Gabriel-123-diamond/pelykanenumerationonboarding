import type { Outlet, UserProfile } from '../types';

type StaffMetrics = { count: number; active: number; pending: number };

const nowStamp = () => new Date().toISOString().slice(0, 10);

const cleanFilePart = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const formatDate = (value: any) => {
  if (!value) return '';
  const date = value?.toDate?.() ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB');
};

const csvEscape = (value: unknown) => {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadBlob = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const toCsv = (headers: string[], rows: Array<Array<unknown>>) => [
  headers.map(csvEscape).join(','),
  ...rows.map((row) => row.map(csvEscape).join(',')),
].join('\n');

const htmlEscape = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const toWordDocument = (title: string, headers: string[], rows: Array<Array<unknown>>) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${htmlEscape(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1c1917; }
    h1 { font-size: 22px; text-transform: uppercase; }
    p { color: #78716c; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 10px; }
    th { background: #1c1917; color: #f59e0b; text-transform: uppercase; }
    th, td { border: 1px solid #e7e5e4; padding: 7px; vertical-align: top; }
  </style>
</head>
<body>
  <h1>${htmlEscape(title)}</h1>
  <p>Generated ${new Date().toLocaleString('en-GB')}</p>
  <table>
    <thead><tr>${headers.map((header) => `<th>${htmlEscape(header)}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map((row) => `<tr>${row.map((cell) => `<td>${htmlEscape(Array.isArray(cell) ? cell.join('; ') : cell)}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

const outletHeaders = [
  'Business Name', 'Town', 'Address', 'Landmark', 'Owner', 'Contact Person', 'Phone', 'WhatsApp', 'Email',
  'Outlet Type', 'Status', 'Grade', 'Action', 'Total Score', 'Interested', 'Products', 'Expected Quantity',
  'Pre-Order Cycle', 'Delivery Cycle', 'Payment Method', 'Can Pay Before Delivery', 'Credit Request (Naira)',
  'Approved Credit Limit (Naira)', 'Route', 'First Supply Date', 'Field Officer', 'Date Visited', 'Updated',
  'Foot Traffic', 'Bread Sales Volume', 'Payment Reliability', 'Route Fit', 'Storage Hygiene', 'Product Interest',
  'Pre-Order Readiness', 'Growth Potential', 'Special Requirements',
];

const outletRows = (outlets: Outlet[]) => outlets.map((outlet) => [
  outlet.name, outlet.town, outlet.address, outlet.landmark, outlet.ownerName, outlet.contactPerson, outlet.phone,
  outlet.whatsapp, outlet.email, outlet.type, outlet.status, outlet.recommendedClass, outlet.recommendedAction,
  outlet.totalScore, outlet.interestedInVilla, outlet.preferredProducts, outlet.expectedDailyQuantity,
  outlet.preOrderCycle, outlet.deliveryCycle, outlet.paymentMethod, outlet.canPayBeforeDelivery,
  outlet.creditRequestDetails, outlet.approvedCreditLimit, outlet.route, outlet.firstSupplyDate,
  outlet.fieldOfficerName, formatDate(outlet.dateVisited), formatDate(outlet.updatedAt),
  outlet.evaluation?.footTraffic, outlet.evaluation?.breadSalesVolume, outlet.evaluation?.paymentReliability,
  outlet.evaluation?.routeFit, outlet.evaluation?.storageHygiene, outlet.evaluation?.productInterest,
  outlet.evaluation?.preOrderReadiness, outlet.evaluation?.growthPotential, outlet.specialRequirements,
]);

export const exportOutletsCsv = (outlets: Outlet[], label = 'outlets') => {
  downloadBlob(`${cleanFilePart(label)}-${nowStamp()}.csv`, `\uFEFF${toCsv(outletHeaders, outletRows(outlets))}`, 'text/csv;charset=utf-8');
};

export const exportOutletsWord = (outlets: Outlet[], label = 'outlets') => {
  downloadBlob(`${cleanFilePart(label)}-${nowStamp()}.doc`, toWordDocument('Outlet Export', outletHeaders, outletRows(outlets)), 'application/msword;charset=utf-8');
};

const staffHeaders = ['Name', 'Email', 'Role', 'Approved', 'Total Work', 'Active/Activated', 'Pending/Rejected'];

const staffRows = (staff: UserProfile[], getMetrics: (staff: UserProfile) => StaffMetrics) => staff.map((member) => {
  const metrics = getMetrics(member);
  return [member.name, member.email, member.role, member.isApproved ? 'Yes' : 'No', metrics.count, metrics.active, metrics.pending];
});

export const exportStaffCsv = (staff: UserProfile[], getMetrics: (staff: UserProfile) => StaffMetrics, label = 'staff') => {
  downloadBlob(`${cleanFilePart(label)}-${nowStamp()}.csv`, `\uFEFF${toCsv(staffHeaders, staffRows(staff, getMetrics))}`, 'text/csv;charset=utf-8');
};

export const exportStaffWord = (staff: UserProfile[], getMetrics: (staff: UserProfile) => StaffMetrics, label = 'staff') => {
  downloadBlob(`${cleanFilePart(label)}-${nowStamp()}.doc`, toWordDocument('Staff Export', staffHeaders, staffRows(staff, getMetrics)), 'application/msword;charset=utf-8');
};
