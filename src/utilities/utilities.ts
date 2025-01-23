import fs from 'fs';
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';

const containerName = process.env.AZURE_RECORDING_CONTAINER_NAME || 'crmpublicimg';
const connectionString = process.env.AZURE_RECORDING_CONNECTION_STRING || 'DefaultEndpointsProtocol=https;AccountName=crm2024;AccountKey=mbmiP06yg1P/sj6xkN/9XQYphp6vbmQARXwHDMiytvnsChxcbHqfqzk5BfDxZ5HSsN5jlWnom/QA+ASthJRHoQ==;EndpointSuffix=core.windows.net';
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export const generateUniqueBlobName = (folderName: string, originalFilename: string): string => {
    const timestamp = Date.now(); // Get current timestamp
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const fileExtension = originalFilename.split('.').pop(); // Extract file extension
    const sanitizedFilename = originalFilename.replace(/[^a-z0-9]/gi, '_'); // Sanitize filename
    return `${folderName}/${sanitizedFilename}_${timestamp}_${randomNumber}.${fileExtension}`;
};

export const uploadFile = async (folderName: string, file: Express.Multer.File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const blobName = generateUniqueBlobName(folderName, file.originalname);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // Upload file to Azure Blob Storage
        blockBlobClient.uploadFile(file.path)
            .then(() => {
                // Construct the URL for accessing the uploaded blob
                const blobUrl = blockBlobClient.url;
                resolve(blobUrl);

                // Delete the file from the upload folder after uploading
                fs.unlink(file.path, (error) => {
                    if (error) {
                        console.error('Error deleting file:', error);
                    }
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const generateZoomAccessToken = async () => {
    try {
        const accountId = 'NJu-3G_hQBWPQlgEhBuP2Q';
        const clientId = 'KAIshXMJR5KKUYysPlyXUQ';
        const clientSecret = 'Grlwocc5IIqBE48Qy4J0ib8Okhl9902x';
        const response = await axios.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
            { },
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating Zoom access token:', error);
        throw new Error('Error generating Zoom access token');
    }
};