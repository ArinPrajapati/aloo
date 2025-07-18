# MongoDB Setup Guide

This project has been migrated from SQLite to MongoDB. Here's how to set up your database:

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string from the "Connect" button
5. Update your `.env` file:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/aloo?retryWrites=true&w=majority"
   ```

## Option 2: Local MongoDB

1. Install MongoDB locally:
   - **Ubuntu/Debian**: `sudo apt install mongodb`
   - **macOS**: `brew install mongodb/brew/mongodb-community`
   - **Windows**: Download from MongoDB website
   
2. Start MongoDB service:
   - **Ubuntu/Debian**: `sudo systemctl start mongodb`
   - **macOS**: `brew services start mongodb/brew/mongodb-community`
   - **Windows**: Start as Windows service

3. Your `.env` should use:
   ```
   DATABASE_URL="mongodb://localhost:27017/aloo"
   ```

## Database Schema Sync

After setting up MongoDB, run:
```bash
npx prisma db push
```

This will create all the necessary collections and indexes in your MongoDB database.

## Migration Changes

- Converted from SQLite to MongoDB
- Updated all model IDs to use `@db.ObjectId`
- Added proper `@map("_id")` annotations
- Updated foreign key relationships for MongoDB compatibility

The application will now store all data in MongoDB instead of the local SQLite file.
