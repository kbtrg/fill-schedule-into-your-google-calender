import { ImageAnnotatorClient } from '@google-cloud/vision';
import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import Tesseract from "tesseract.js";

// サービスアカウントキーを設定
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/Users/kuboryu/Downloads/calender-extract-621585526f63.json"

export const config = {
  api: {
    bodyParser: false, // デフォルトのボディパーサーを無効化
  },
};

const client = new ImageAnnotatorClient();

async function recognizeText(filePath: string) {
  try {
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    const text = detections.length > 0 ? detections[0].description : 'No text found';
    console.log('Detected text:', text);
    return text;
  } catch (error) {
    console.error('Error with Google Vision API:', error);
    throw new Error('Error with Google Vision API');
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  console.log("Called PerseImage API...")
  console.log("URL: ", req.url)
  
  if(req.url === "/api/perseImage" && req.method === "POST") {
    const form = formidable();
  
    let fields, files
    try {
      [fields, files] = await form.parse(req);

      if (!files || !files.image) {
        res.status(400).json({ error: "No Image Uploaded" })
        return
      }

      // 画像のファイルパスを取得
      const filePath = files.image[0].filepath
      console.log(filePath)


      // Google Cloud Vision API への処理を実行
      recognizeText(filePath)
      .then((text) => {
        res.status(200).json({ text });
      })
      .catch((error) => {
        console.log('Error recognizing text:', error);
        res.status(500).json({ error: 'Error recognizing text' });
      });
      

    } catch (err) {
      console.log(err)
    }
  
    // フロントにデータを返す
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ fields, files }, null, 2));
    return;
  }

  console.log(res)
}