import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: '_DUMMY_API_KEY_',
  httpOptions: {
    apiVersion: '',
    baseUrl: window.location.origin + '/gemini-proxy',
  },
});

export default genAI;
