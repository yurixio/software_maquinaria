import React, { useState, useRef } from 'react';
import { Upload, File, X, Eye, Download, Plus } from 'lucide-react';
import { Attachment } from '../../types';

interface AttachmentUploadProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'],
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      // Check file count
      if (attachments.length + newAttachments.length >= maxFiles) {
        errors.push(`Máximo ${maxFiles} archivos permitidos`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name} excede el tamaño máximo de ${maxFileSize}MB`);
        return;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        errors.push(`${file.name} no es un tipo de archivo permitido`);
        return;
      }

      // Create attachment object
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        uploadedBy: 'current-user' // In real app, get from auth context
      };

      newAttachments.push(attachment);
    });

    if (errors.length > 0) {
      setUploadError(errors.join(', '));
      setTimeout(() => setUploadError(null), 5000);
    }

    if (newAttachments.length > 0) {
      onAttachmentsChange([...attachments, ...newAttachments]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeAttachment = (attachmentId: string) => {
    const attachment = attachments.find(a => a.id === attachmentId);
    if (attachment && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
    onAttachmentsChange(attachments.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    return '📎';
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-2">
          Arrastra archivos aquí o{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            selecciona archivos
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Máximo {maxFiles} archivos, {maxFileSize}MB cada uno
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Formatos: {acceptedTypes.join(', ')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Archivos adjuntos ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-lg">{getFileIcon(attachment.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)} • {attachment.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(attachment.url, '_blank')}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ver archivo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};