import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export class ElevenLabs {

    instance = axios.create({
        baseURL: 'https://api.elevenlabs.io/',
        headers: {
            'xi-api-key': Buffer.from('c2tfNGI5NmVmMjZjMzY1ZWRiMzliMzRlNmZjMmE3ODdjODVjMzE4Njg4OGVjOWIzMGRi', 'base64').toString('utf-8'),
            'Content-Type': 'application/json',
        },
    });

    async request(data: AxiosRequestConfig) {
        try {
            const res = await this.instance.request(data);
            return res.data;
        } catch(err) {
            if ( err instanceof AxiosError ) {
                console.log('axios error', err.code, err.response?.data);
            }
        }
    }

    getVoices() {
        return this.request({
            url: '/v1/voices',
            method: 'GET',
        });
    }

    tts(text: string, voiceId: string) {
        return this.request({
            url: `/v1/text-to-speech/${voiceId}`,
            method: 'POST',
            responseType: 'arraybuffer',
            data: {
                "text": text,
                "model_id": "eleven_turbo_v2_5",
                "voice_settings": {
                    "stability": 0.9,
                    "similarity_boost": 0.9,
                    "style": 0.5,
                    "use_speaker_boost": true
                }
            }
        });
    }

}