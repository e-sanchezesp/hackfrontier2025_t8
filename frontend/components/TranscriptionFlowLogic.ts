import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Buffer } from 'buffer';

// MODIFICA AQUÍ: Tu API key de AssemblyAI
const ASSEMBLY_API_KEY = 'de840adc367d47e39def837dd87f0fd9';
// MODIFICA AQUÍ: Tu URL de webhook de n8n
const N8N_WEBHOOK_URL = 'https://tlapa.app.n8n.cloud/webhook/ba2dc3f2-3dfd-4ae8-88fe-ddece4e273e4';
// MODIFICA AQUÍ: La URL de tu backend
const BACKEND_URL = 'https://b56e34452c62.ngrok-free.app/api/users/first-user';

export async function runTranscriptionFlow(
  mp3Path: string,
  setStatus: (msg: string) => void,
  setTranscript: (txt: string) => void,
  setUser: (user: any) => void,
  setN8nResponse: (resp: any) => void
) {
  try {
    setStatus('Leyendo archivo...');
    setTranscript('');
    setUser(null);
    setN8nResponse(null);
    console.log('[Flujo] Iniciando lectura de archivo:', mp3Path);

    // 1. Leer archivo mp3 como base64 y convertir a buffer
    const fileData = await FileSystem.readAsStringAsync(mp3Path, { encoding: FileSystem.EncodingType.Base64 });
    const buffer = Buffer.from(fileData, 'base64');
    console.log('[Flujo] Archivo leído y convertido a buffer. Tamaño:', buffer.length);

    setStatus('Subiendo a AssemblyAI...');
    console.log('[Flujo] Subiendo a AssemblyAI...');
    const uploadRes = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      buffer,
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
          'content-type': 'application/octet-stream',
        },
      }
    );
    const uploadUrl = uploadRes.data.upload_url;
    console.log('[Flujo] Archivo subido a AssemblyAI. upload_url:', uploadUrl);

    setStatus('Solicitando transcripción...');
    console.log('[Flujo] Solicitando transcripción a AssemblyAI...');
    const transcriptRes = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url: uploadUrl },
      { headers: { authorization: ASSEMBLY_API_KEY } }
    );
    const transcriptId = transcriptRes.data.id;
    console.log('[Flujo] Transcripción solicitada. transcriptId:', transcriptId);

    setStatus('Esperando transcripción...');
    let completed = false, transcriptText = '';
    while (!completed) {
      await new Promise(r => setTimeout(r, 4000));
      console.log('[Flujo] Haciendo polling a AssemblyAI para transcriptId:', transcriptId);
      const pollRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLY_API_KEY } }
      );
      console.log('[Flujo] Polling AssemblyAI status:', pollRes.data.status);
      if (pollRes.data.status === 'completed') {
        completed = true;
        transcriptText = pollRes.data.text;
        console.log('[Flujo] Transcripción completada:', transcriptText);
      } else if (pollRes.data.status === 'failed') {
        throw new Error('Transcripción fallida');
      }
    }
    setTranscript(transcriptText);

    setStatus('Obteniendo usuario...');
    console.log('[Flujo] Consultando usuario en backend:', BACKEND_URL);
    const userRes = await axios.get(BACKEND_URL);
    setUser(userRes.data);
    console.log('[Flujo] Usuario obtenido:', userRes.data);

    setStatus('Enviando texto a n8n...');
    // Generar un timestamp único para identificar este mensaje
    const messageTimestamp = new Date().toISOString();
    console.log('[Flujo] Timestamp del mensaje:', messageTimestamp);
    
    // Enviar el texto transcrito y user_id al webhook de n8n
    const params = new URLSearchParams({
      user_id: userRes.data.id,
      texto: transcriptText,
      timestamp: messageTimestamp,
    }).toString();
    const n8nUrl = `${N8N_WEBHOOK_URL}?${params}`;
    console.log('[Flujo] Enviando a n8n (GET):', n8nUrl);
    await axios.get(n8nUrl);
    setStatus('Esperando respuesta procesada de n8n...');
    // Polling al endpoint /n8n-last-message
    let processed = false;
    let lastMessage = null;
    const LAST_MESSAGE_URL = 'https://b56e34452c62.ngrok-free.app/api/users/n8n-last-message';
    for (let i = 0; i < 30 && !processed; i++) { // hasta 2 min
      await new Promise(r => setTimeout(r, 4000));
      try {
        console.log('[Flujo] Polling /n8n-last-message...');
        const res = await axios.get(LAST_MESSAGE_URL);
        console.log('[Flujo] Respuesta del polling:', res.data);
        if (res.data && res.data.mensaje && res.data.user_id === userRes.data.id) {
          lastMessage = res.data;
          processed = true;
          console.log('[Flujo] Mensaje procesado recibido:', lastMessage);
        } else {
          console.log('[Flujo] Mensaje no coincide o no tiene formato correcto');
        }
      } catch (e: any) {
        console.log('[Flujo] Error en polling:', e.message);
        // Puede ser 404 si aún no hay mensaje
      }
    }
    if (processed && lastMessage) {
      console.log('[Flujo] Configurando n8nResponse para reproducción:', lastMessage);
      setN8nResponse(lastMessage);
      setStatus('¡Listo!');
    } else {
      console.log('[Flujo] No se procesó el mensaje. processed:', processed, 'lastMessage:', lastMessage);
      setStatus('No se recibió respuesta procesada de n8n.');
    }
  } catch (err: any) {
    setStatus('Error: ' + (err.response?.data?.error || err.message));
    console.log('[Flujo][ERROR]', err);
    alert('Error en flujo: ' + (err.response?.data?.error || err.message));
  }
} 