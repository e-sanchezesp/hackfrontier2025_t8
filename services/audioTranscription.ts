import RNFS from 'react-native-fs';
import axios from 'axios';

// PON AQUÍ TU API KEY DE ASSEMBLYAI
const ASSEMBLYAI_API_KEY = 'de840adc367d47e39def837dd87f0fd9';

// PON AQUÍ TU URL DEL WEBHOOK DE N8N
const N8N_WEBHOOK_URL = 'https://tlapa.app.n8n.cloud/webhook/ba2dc3f2-3dfd-4ae8-88fe-ddece4e273e4'; // <-- CAMBIA ESTO

// PON AQUÍ TU ENDPOINT PARA OBTENER EL PRIMER USUARIO
const FIRST_USER_API = 'http://localhost:4000/api/first-user'; // <-- CAMBIA ESTO

export async function uploadAudioToAssemblyAI(localFilePath: string): Promise<string> {
  const fileData = await RNFS.readFile(localFilePath, 'base64');
  const response = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    Buffer.from(fileData, 'base64'),
    {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'transfer-encoding': 'chunked',
        'content-type': 'application/octet-stream',
      },
    }
  );
  return response.data.upload_url;
}

export async function requestTranscription(uploadUrl: string): Promise<string> {
  const response = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: uploadUrl, language_code: 'es' },
    { headers: { authorization: ASSEMBLYAI_API_KEY } }
  );
  return response.data.id;
}

export async function pollTranscription(transcriptId: string): Promise<string> {
  const url = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
  while (true) {
    const response = await axios.get(url, {
      headers: { authorization: ASSEMBLYAI_API_KEY }
    });
    if (response.data.status === 'completed') {
      return response.data.text;
    }
    if (response.data.status === 'failed') {
      throw new Error('Transcripción fallida');
    }
    await new Promise(res => setTimeout(res, 3000)); // Espera 3 segundos
  }
}

export async function getFirstUser(): Promise<{ id: string, full_name: string, date_of_birth: string, gender: string }> {
  const response = await axios.get(FIRST_USER_API);
  return response.data;
}

/**
 * Envía el user_id y el texto transcrito al webhook de n8n y devuelve la respuesta del webhook (se espera JSON).
 */
export async function sendToN8nWebhook({ user_id, text }: { user_id: string, text: string }) {
  const response = await axios.post(N8N_WEBHOOK_URL, { user_id, text });
  return response.data; // Devuelve la respuesta de n8n
} 