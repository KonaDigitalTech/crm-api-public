import express, { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Vimeo } from 'vimeo';
// import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { promisify } from 'util';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// Zoom API credentials
const zoomClientId = 'KAIshXMJR5KKUYysPlyXUQ';
const zoomClientSecret = 'iNNqHKKQozIeiTP1Y3AYXXZXOaoTF4If';

// Vimeo API credentials
const vimeoClientId = '3b15385d9d7dd61d46f400b7c3e8c44c692e04e9';
const vimeoClientSecret = 'ecLrTlzQ7HUZlO4dkbSXqsfsnmch/hJJVZGEc0AkV3m8pNh9b0iPvtlnAhKY8dKF2WKLi7SlvBZxoMIgA0JApCCkw6PsI2U5z/yOOXu4z3EjwtUlVtDmvtvkenfvpR4S';

// Generate JWT access token for Zoom
async function generateZoomAccessToken() {
    try {
        const response = await axios.post(
            'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=NJu-3G_hQBWPQlgEhBuP2Q',
            null,
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${zoomClientId}:${zoomClientSecret}`).toString('base64')}`
                }
            }
        );
        return response.data.access_token;
    } catch (error: any) {
        console.error('Error generating Zoom access token:', error.response.data);
        throw error;
    }
}

// Authenticate with Vimeo and obtain access token
const getVimeoAccessToken = async (): Promise<string> => {
    try {
        const response = await axios.post(
            'https://api.vimeo.com/oauth/authorize/client',
            null,
            {
                auth: {
                    username: vimeoClientId,
                    password: vimeoClientSecret,
                },
                params: {
                    grant_type: 'client_credentials',
                    scope: 'upload'
                },
            }
        );

        return response.data.access_token;
    } catch (error: any) {
        console.error('Error obtaining Vimeo access token:', error.response.data);
        throw error;
    }
};

// Initialize Vimeo client
const initVimeoClient = async (): Promise<Vimeo> => {
    const accessToken = await getVimeoAccessToken();
    console.log(accessToken, 'accesstoken');
    return new Vimeo(vimeoClientId, vimeoClientSecret, accessToken);
};

// Authenticate with Vimeo and obtain access token
const getUserAccountIds = async (accessToken: string) => {
    try {
        const response = await axios.get('https://api.zoom.us/v2/users', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userIds = response.data.users.map((user: any) => user.id);
        return userIds;
    } catch (error: any) {
        console.error('Error obtaining zoom access token:', error.response.data);
        throw error;
    }
};

const unlinkAsync = promisify(fs.unlink);

export const downloadAndUploadRecordings = async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = await generateZoomAccessToken();
        const userIds = await getUserAccountIds(accessToken);
        let allRecordings: any[] = [];

        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const startHour = req.query.startHour as string;

        for (const userId of userIds) {
            try {
                const response = await axios.get(`https://api.zoom.us/v2/users/${userId}/recordings`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    params: {
                        from: startDate,
                        to: endDate
                    }
                });
                const userRecordings = response.data.meetings;

                // Filter recordings by recording type 'shared_screen_with_speaker_view'
                const sharedScreenRecordings = userRecordings.filter((recording: any) => {
                    recording.recording_files = recording.recording_files.find((file: any) => file.recording_type === "shared_screen_with_speaker_view");
                    return recording;
                });

                // Push mapped recordings to allRecordings array
                allRecordings = [...allRecordings, ...sharedScreenRecordings];


            } catch (error) {
                console.error(`Error retrieving recordings for user ${userId}:`, error);
            }
        }

        let filteredRecordings = allRecordings.filter((recording) => {
            const startRecordingHour = new Date(recording.start_time).getHours();
            return startRecordingHour >= +startHour;
        });

        filteredRecordings = [filteredRecordings[0]];

        const vimeoClient = await initVimeoClient();

        for (const recording of filteredRecordings) {
            console.log(recording.recording_files);
            const downloadUrl = recording.recording_files.download_url;
            const response = await axios.get(downloadUrl, {
                responseType: 'stream', headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const videoFileName = `recordings/${recording.id}.mp4`;
            const videoFileStream = fs.createWriteStream(videoFileName);
            response.data.pipe(videoFileStream);

            // Wait for the download to finish
            await new Promise((resolve, reject) => {
                videoFileStream.on('finish', () => {
                    console.log('Video download complete');
                    resolve('');
                });
                videoFileStream.on('error', (err) => {
                    console.error('Error downloading video:', err);
                    reject(err);
                });
            });

            await new Promise<void>((resolve, reject) => {
                ffmpeg(videoFileName)
                    .videoCodec('libx264')
                    .outputOptions('-crf 28')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(`${videoFileName}.compressed.mp4`);
            });

            const recordingStartTime = new Date(recording.recording_files.recording_start);

            // Extracting date, month, year, and hour
            const date = recordingStartTime.getDate();
            const month = recordingStartTime.getMonth() + 1; // Month is zero-based, so adding 1
            const year = recordingStartTime.getFullYear();
            const hour = recordingStartTime.getHours();

            const dateString = `${date}-${month}-${year} ${hour}h`;

            const compressedVideoFileName = `${videoFileName}.compressed.mp4`;
            const videoName = recording.topic ? `${recording.topic} - ${dateString}` : `Untitled Video - ${dateString}`;
            const videoDescription = recording.agenda || 'No description';
            const videoFile: any = {
                file: fs.createReadStream(compressedVideoFileName),
                name: videoName,
                description: videoDescription,
            };
            vimeoClient.upload(
                videoFile,
                (uri: any) => {
                    console.log(`Video "${videoName}" uploaded to Vimeo: ${uri}`);
                    unlinkAsync(videoFileName)
                        .then(() => unlinkAsync(compressedVideoFileName))
                        .catch((err: Error) => console.error('Error deleting files:', err));
                },
                (bytesUploaded, bytesTotal) => {
                    console.log(`Uploaded ${bytesUploaded} of ${bytesTotal} bytes`);
                },
                (error: any) => {
                    console.error('Error uploading video to Vimeo:', error);
                    // unlinkAsync(videoFileName)
                    //     .then(() => unlinkAsync(compressedVideoFileName))
                    //     .catch((err: Error) => console.error('Error deleting files:', err));
                }
            );
        }

        res.status(200).send({ allRecordings: allRecordings.length, filteredRecordingsc: filteredRecordings.length, filteredRecordings });
    } catch (error) {
        console.error('Error retrieving or uploading recordings:', error);
        res.status(500).send('Error retrieving or uploading recordings');
    }
};
