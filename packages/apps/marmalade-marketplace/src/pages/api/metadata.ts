import { IncomingForm } from 'formidable';
import fs from 'fs';
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: false,
  },
};
const saveFile = async (file: any) => {
  try {
    const filepath = file[0].filepath;
    console.log(filepath);
    const stream = fs.createReadStream(filepath);
    const options = {
      pinataMetadata: {
        name: file[0].originalFilename,
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    fs.unlinkSync(filepath);
    return response;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const form = new IncomingForm();
      form.parse(req, async function (err: any, fields: any, files: any) {
        if (err) {
          console.log({ err });
          return res.status(500).send('Upload Error');
        }
        const response = await saveFile(files.file);
        const { IpfsHash } = response;

        return res.send(IpfsHash);
      });
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Error');
    }
  } else if (req.method === 'GET') {
    try {
      const response = await pinata.pinList(
        { pinataJWTKey: process.env.PINATA_JWT },
        {
          pageLimit: 1,
        },
      );
      res.json(response.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Error');
    }
  }
}
