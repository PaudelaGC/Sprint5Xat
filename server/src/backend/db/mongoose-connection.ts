import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://paugctrabajo:1234@userdb.itvke2t.mongodb.net/'
    )
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

export default connectDB
