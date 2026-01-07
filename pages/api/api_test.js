import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      mongooseVersion: require('mongoose').version
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      mongooseVersion: require('mongoose').version
    });
  }
}