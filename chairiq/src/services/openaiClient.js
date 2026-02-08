import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '_DUMMY_API_KEY_',
  baseURL: '/openai-proxy',
  dangerouslyAllowBrowser: true,
});

export default openai;
