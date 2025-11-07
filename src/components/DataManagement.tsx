import { useRef } from 'react';

interface DataManagementProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export function DataManagement({ onExport, onImport }: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Export your data as a JSON backup file or restore from a previous backup.
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onExport}
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium"
        >
          Export Backup
        </button>
        <button
          onClick={handleImportClick}
          className="bg-green-600 dark:bg-green-700 text-white px-4 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition font-medium"
        >
          Import Backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
