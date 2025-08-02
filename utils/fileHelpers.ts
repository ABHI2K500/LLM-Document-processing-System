export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, index)).toFixed(2);
  
  return `${size} ${sizes[index]}`;
};

export const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('text')) return '📃';
  return '📄';
};

export const createDocumentFromFile = (file: File) => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: file.name,
  type: file.type,
  size: file.size,
  uploadedAt: new Date(),
  content: `Sample content for ${file.name}`
});