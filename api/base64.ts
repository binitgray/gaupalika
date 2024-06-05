import axios from 'axios';
import { Buffer } from 'buffer';

export async function urlToBase64(url:string) {

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    
    const dataURI = `data:${response.headers['content-type']};base64,${base64}`;

    return dataURI;
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
}
