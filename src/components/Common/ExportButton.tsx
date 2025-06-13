import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, X } from 'lucide-react';
import { useExport } from '../../hooks/useExport';

interface ExportButtonProps {
  data: any[];
  module: string;
  title?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  module,
  title,
  className = ''
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const { isExporting, exportProgress, exportError, exportToExcel, exportToPDF, exportToCSV } = useExport();

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    setShowOptions(false);
    
    switch (format) {
      case 'excel':
        await exportToExcel(module, data, title);
        break;
      case 'pdf':
        await exportToPDF(module, data, title);
        break;
      case 'csv':
        await exportToCSV(module, data, title);
        break;
    }
  };

  if (isExporting) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Exportando... {exportProgress}%</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={`flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
        disabled={data.length === 0}
      >
        <Download className="w-4 h-4" />
        <span>Exportar</span>
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <button
              onClick={() => handleExport('excel')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span>PDF (.pdf)</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <File className="w-4 h-4 text-blue-600" />
              <span>CSV (.csv)</span>
            </button>
          </div>
        </div>
      )}

      {showOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowOptions(false)}
        />
      )}

      {exportError && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-red-50 border border-red-200 rounded-lg p-3 z-10">
          <div className="flex items-start space-x-2">
            <X className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error al exportar</p>
              <p className="text-xs text-red-600 mt-1">{exportError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};