export interface File {
  extension: '.png';
  id: string;
  mimeType: string;
  name: string;
  ownerId: string;
  tags: string[];
  versions: [
    {
      created_at: string;
      status: 'complete';
      version: number;
    },
    {
      created_at: string;
      file: {
        category: 'simple';
        fileName: string;
        sizeInBytes: number;
        status: 'complete';
        uploadId: string;
        url: string;
      };
      status: 'complete';
      version: number;
    },
  ];
}
