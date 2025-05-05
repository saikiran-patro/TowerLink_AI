import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const handleGeminiRequest = async (queryObject) => {
  const { text, imageBase64 } = queryObject;

  const parts = [];

  if (text) parts.push({ text });

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg', // Adjust if PNG etc.
        data: imageBase64,
      },
    });
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const aiResponse =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text? {data:response?.data?.candidates?.[0]?.content?.parts?.[0]?.text,status:true}  : {data:"Can't process this task.",status:false}
    return aiResponse;
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    return {data:"Can't be processed!",status:false};
  }
};
