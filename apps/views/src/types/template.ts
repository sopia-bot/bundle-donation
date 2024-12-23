import { Voice as ElevenLabsVoice } from "elevenlabs/api";

export interface TemplateVoice {
    name: string;
    voiceId: string;
}

export interface Voice extends ElevenLabsVoice {
    checked: boolean
}

export interface Template {
    name: string;
    uuid: string;
    useType: 1 | 2; // 1: use sticker, 2: use threshold
    sticker: string;
    threshold: number;
    voice: string;
    volume: number;
    voices: TemplateVoice[];
}