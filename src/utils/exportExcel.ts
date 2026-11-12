import * as XLSX from 'xlsx';
import { Lead, Deal, Customer } from '../types/crm';

export const exportCRMToExcel = (leads: Lead[], deals: Deal[], customers: Customer[]) => {
  const workbook = XLSX.utils.book_new();

  // 1. Executive Summary Sheet
  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const totalClosedWon = deals.filter((d) => d.stage === 'Closed Won').reduce((sum, d) => sum + d.value, 0);
  const totalARR = customers.reduce((sum, c) => sum + (c.mrr * 12), 0);

  const summaryData = [
    { Metric: 'Platform', Value: 'Vanguard CRM Platform' },
    { Metric: 'Export Timestamp', Value: new Date().toLocaleString('en-IN') },
    { Metric: 'Total Leads Count', Value: leads.length },
    { Metric: 'Total Pipeline Deals Count', Value: deals.length },
    { Metric: 'Total Pipeline Value (₹)', Value: totalPipeline },
    { Metric: 'Closed Won Revenue (₹)', Value: totalClosedWon },
    { Metric: 'Total Customer Accounts', Value: customers.length },
    { Metric: 'Total Portfolio ARR (₹)', Value: totalARR },
    { Metric: 'Currency Standard', Value: 'INR (₹)' },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  // 2. Leads Sheet
  const leadsData = leads.map((l) => ({
    'Lead Name': l.name,
    'Company': l.company,
    'Job Title': l.title,
    'Email Address': l.email,
    'Phone': l.phone,
    'Estimated Value (₹)': l.value,
    'Status': l.status,
    'Source Channel': l.source,
    'Lead Score': l.score,
    'Assigned Representative': l.assignedTo,
    'Created Date': l.createdAt,
  }));
  const leadsSheet = XLSX.utils.json_to_sheet(leadsData);
  XLSX.utils.book_append_sheet(workbook, leadsSheet, 'Leads');

  // 3. Deals Sheet
  const dealsData = deals.map((d) => ({
    'Deal Title': d.title,
    'Client Organization': d.company,
    'Primary Contact': d.contactName,
    'Contact Email': d.contactEmail,
    'Deal Value (₹)': d.value,
    'Pipeline Stage': d.stage,
    'Win Probability (%)': `${d.probability}%`,
    'Expected Close Date': d.expectedCloseDate,
    'Assigned Representative': d.assignedTo,
    'Priority Level': d.priority,
  }));
  const dealsSheet = XLSX.utils.json_to_sheet(dealsData);
  XLSX.utils.book_append_sheet(workbook, dealsSheet, 'Deals Pipeline');

  // 4. Customers Sheet
  const customersData = customers.map((c) => ({
    'Organization Name': c.company,
    'Key Executive': c.name,
    'Contact Email': c.email,
    'Phone': c.phone,
    'Industry Vertical': c.industry,
    'Enterprise Tier': c.tier,
    'Account Status': c.status,
    'Annual Recurring Revenue (₹)': c.mrr * 12,
    'Monthly Recurring Revenue (₹)': c.mrr,
    'Lifetime Value (₹)': c.lifetimeValue,
    'Account Director': c.accountManager,
  }));
  const customersSheet = XLSX.utils.json_to_sheet(customersData);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customer Accounts');

  // Set clean column widths for Excel readability
  const sheets = [summarySheet, leadsSheet, dealsSheet, customersSheet];
  sheets.forEach((sheet) => {
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
    const colWidths: { wch: number }[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      colWidths.push({ wch: 22 });
    }
    sheet['!cols'] = colWidths;
  });

  const exportDate = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Vanguard_CRM_Data_${exportDate}.xlsx`);
};

export const exportLeadsToExcel = (leads: Lead[]) => {
  const workbook = XLSX.utils.book_new();
  const leadsData = leads.map((l) => ({
    'Lead Name': l.name,
    'Company': l.company,
    'Job Title': l.title,
    'Email Address': l.email,
    'Phone': l.phone,
    'Estimated Value (₹)': l.value,
    'Status': l.status,
    'Source Channel': l.source,
    'Lead Score': l.score,
    'Assigned Representative': l.assignedTo,
    'Created Date': l.createdAt,
  }));
  const sheet = XLSX.utils.json_to_sheet(leadsData);
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  const colWidths: { wch: number }[] = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    colWidths.push({ wch: 22 });
  }
  sheet['!cols'] = colWidths;
  XLSX.utils.book_append_sheet(workbook, sheet, 'Leads');

  const exportDate = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Vanguard_Leads_${exportDate}.xlsx`);
};
