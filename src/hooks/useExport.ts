import { useState, useCallback } from 'react';
import { ExportRequest } from '../types';

interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  module: string;
  data: any[];
  filters?: Record<string, any>;
  columns?: string[];
  title?: string;
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportData = useCallback(async (options: ExportOptions) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setExportProgress(100);

      // Generate download based on format
      const blob = await generateExportFile(options);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${options.module}_${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Reset state after successful export
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Error al exportar');
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  const exportToExcel = useCallback((module: string, data: any[], title?: string) => {
    return exportData({
      format: 'excel',
      module,
      data,
      title
    });
  }, [exportData]);

  const exportToPDF = useCallback((module: string, data: any[], title?: string) => {
    return exportData({
      format: 'pdf',
      module,
      data,
      title
    });
  }, [exportData]);

  const exportToCSV = useCallback((module: string, data: any[], title?: string) => {
    return exportData({
      format: 'csv',
      module,
      data,
      title
    });
  }, [exportData]);

  return {
    isExporting,
    exportProgress,
    exportError,
    exportData,
    exportToExcel,
    exportToPDF,
    exportToCSV
  };
};

async function generateExportFile(options: ExportOptions): Promise<Blob> {
  const { format, data, title = 'Export' } = options;

  switch (format) {
    case 'csv':
      return generateCSV(data);
    case 'excel':
      return generateExcel(data, title);
    case 'pdf':
      return generatePDF(data, title);
    default:
      throw new Error('Formato de exportación no soportado');
  }
}

function generateCSV(data: any[]): Blob {
  if (data.length === 0) {
    return new Blob(['No hay datos para exportar'], { type: 'text/csv' });
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

function generateExcel(data: any[], title: string): Blob {
  // Simplified Excel generation (in real app, use a library like xlsx)
  const csvContent = generateCSV(data);
  return new Blob([csvContent], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

function generatePDF(data: any[], title: string): Blob {
  // Simplified PDF generation (in real app, use a library like jsPDF)
  const content = `
    ${title}
    
    ${data.map(item => JSON.stringify(item, null, 2)).join('\n\n')}
  `;
  
  return new Blob([content], { type: 'application/pdf' });
}