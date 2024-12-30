import { OpenAISdkSTTSClient } from "@/client-assistance/infrastructure/OpenAISdkSTTClient";

export interface STTClient {
    transcribeAudio(audioPath: string): Promise<string>;
}


export const sttClient = new OpenAISdkSTTSClient();