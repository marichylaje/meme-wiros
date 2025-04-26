import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { capitalizeFirstLetter } from '../../../utils/capitalize';

type TemplateInfo = {
  name: string;
  sides: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TemplateInfo[]>
) {
  const templatesDir = path.join(process.cwd(), 'public', 'templates');

  const templates = fs.readdirSync(templatesDir).map((folder) => {
    const folderPath = path.join(templatesDir, folder);

    // Nos aseguramos de que sea una carpeta
    const isDirectory = fs.lstatSync(folderPath).isDirectory();
    if (!isDirectory) return null;

    // Contamos los archivos imgX.png (no borders.png)
    const files = fs.readdirSync(folderPath);
    const sideImages = files.filter((file) => /^img\d+\.png$/.test(file));

    return {
      name: capitalizeFirstLetter(folder),
      sides: sideImages.length,
    };
  });

  const filteredTemplates = templates.filter(Boolean) as TemplateInfo[];

  res.status(200).json(filteredTemplates);
}
