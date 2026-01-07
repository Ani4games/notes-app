import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const notes = await Note.find({}).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, data: notes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        const note = await Note.create(req.body);
        res.status(201).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}