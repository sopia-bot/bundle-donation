import axios, { AxiosRequestConfig } from 'axios';

export class ElevenLabs {

    instance = axios.create({
        baseURL: 'https://api.elevenlabs.io/',
        headers: {
            'xi-api-key': Buffer.from('c2tfNGI5NmVmMjZjMzY1ZWRiMzliMzRlNmZjMmE3ODdjODVjMzE4Njg4OGVjOWIzMGRi', 'base64').toString('utf-8'),
            'Content-Type': 'application/json',
        },
    });

    async request(data: AxiosRequestConfig) {
        const res = await this.instance(data);
        return res.data;
    }

    getVoices() {
        return this.request({
            url: '/v1/voices',
            method: 'GET',
        });
    }

}