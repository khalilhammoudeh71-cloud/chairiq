import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { procedureCodesService } from '../../services/procedureCodesService';
import { useToast } from '../../hooks/useToast';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import DentistNavigation from '../../components/DentistNavigation';

export default function AdminProcedureCodesImport() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState(null);
  const [importResults, setImportResults] = useState(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e?.target?.files?.[0];
    if (selectedFile) {
      if (selectedFile?.type !== 'text/csv' && !selectedFile?.name?.endsWith('.csv')) {
        showToast('Please select a CSV file', 'error');
        return;
      }
      setFile(selectedFile);
      setImportResults(null);
    }
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text?.split('\n')?.filter(line => line?.trim());
    if (lines?.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row');
    }

    const headers = lines?.[0]?.split(',')?.map(h => h?.trim()?.toLowerCase());
    const codeIndex = headers?.indexOf('code');
    const titleIndex = headers?.indexOf('title');
    const categoryIndex = headers?.indexOf('category');

    if (codeIndex === -1 || titleIndex === -1) {
      throw new Error('CSV must contain "code" and "title" columns');
    }

    const data = [];
    for (let i = 1; i < lines?.length; i++) {
      const values = lines?.[i]?.split(',')?.map(v => v?.trim());
      if (values?.length >= 2) {
        data?.push({
          code: values?.[codeIndex],
          title: values?.[titleIndex],
          category: categoryIndex !== -1 ? values?.[categoryIndex] : null
        });
      }
    }

    return data;
  };

  // Handle CSV import
  const handleImport = async () => {
    if (!file) {
      showToast('Please select a file first', 'error');
      return;
    }

    setImporting(true);
    try {
      const text = await file?.text();
      const csvData = parseCSV(text);

      if (csvData?.length === 0) {
        showToast('No valid data found in CSV file', 'error');
        return;
      }

      const result = await procedureCodesService?.importFromCSV(csvData);
      
      setImportResults({
        total: csvData?.length,
        imported: result?.length,
        timestamp: new Date()?.toISOString()
      });

      showToast(`Successfully imported ${result?.length} procedure codes`, 'success');
    } catch (error) {
      showToast(`Error importing CSV: ${error?.message}`, 'error');
    } finally {
      setImporting(false);
    }
  };

  // Download sample CSV template
  const downloadTemplate = () => {
    const csvContent = 'code,title,category\nD0120,Periodic oral evaluation,Diagnostic\nD0140,Limited oral evaluation - problem focused,Diagnostic\nD1110,Prophylaxis - adult,Preventive';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document?.createElement('a');
    a?.setAttribute('href', url);
    a?.setAttribute('download', 'procedure_codes_template.csv');
    a?.click();
  };

  return (
    <div className="min-h-screen bg-bg-0 p-4 md:p-8">
      <DentistNavigation />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card p-8 mb-8">
          <h1 className="text-4xl font-bold text-text-1 mb-2">Import Procedure Codes</h1>
          <p className="text-text-2 text-lg">Upload CSV file to import CDT/ADA procedure codes</p>
        </div>

        {/* Import Section */}
        <div className="card p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-1 mb-4">CSV File Upload</h2>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer transition-colors shadow-lg"
                >
                  <FileText size={20} />
                  Select CSV File
                </label>
                {file && (
                  <span className="text-blue-200 font-medium">{file?.name}</span>
                )}
              </div>

              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors shadow-lg w-fit"
              >
                <Download size={20} />
                Download Sample Template
              </button>
            </div>

            {/* CSV Format Instructions */}
            <div className="bg-blue-900/30 border border-blue-400/50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-bold text-blue-200 mb-2">CSV Format Requirements</h3>
                  <ul className="list-disc list-inside text-blue-100 space-y-1">
                    <li>First row must be headers: code, title, category</li>
                    <li>Code column (required): ADA/CDT procedure code (e.g., D0120)</li>
                    <li>Title column (required): Procedure description</li>
                    <li>Category column (optional): Procedure category (e.g., Diagnostic, Preventive)</li>
                    <li>Each row represents one procedure code</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-lg font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Upload size={24} />
              {importing ? 'Importing...' : 'Import Procedure Codes'}
            </button>
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="bg-green-900/30 border border-green-400/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-300 mb-4">Import Successful!</h3>
              <div className="grid grid-cols-2 gap-4 text-green-100">
                <div>
                  <span className="font-semibold">Total Records:</span>
                  <span className="ml-2">{importResults?.total}</span>
                </div>
                <div>
                  <span className="font-semibold">Imported:</span>
                  <span className="ml-2">{importResults?.imported}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Timestamp:</span>
                  <span className="ml-2">{new Date(importResults?.timestamp)?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}