# 📚 MERN Stack Learning Guide
## Master These Concepts Before Continuing Your Tutorial

> **Purpose:** Reference document to learn/review fundamentals before diving deeper into your MERN tutorial  
> **Current Project:** Notes App Backend (Mid-section)  
> **Stack:** MongoDB + Express + React + Node.js

---

## 🎯 SECTION 1: JavaScript/Node.js Prerequisites

### ES6+ Features You Must Know Cold
```javascript
// 1. Variables & Scoping
const PI = 3.14159;           // Block-scoped, cannot reassign
let count = 0;                // Block-scoped, can reassign
// Avoid: var (function-scoped, hoisting issues)

// 2. Arrow Functions
const add = (a, b) => a + b;  // Implicit return
const greet = name => `Hi ${name}`;  // Single param, no parens needed
const obj = () => ({ key: "value" }); // Return object literal

// 3. Destructuring
const { title, content } = req.body;        // Object
const [first, second] = array;              // Array
const { user: { name } } = req;             // Nested

// 4. Spread/Rest Operator
const newObj = { ...oldObj, updated: true };  // Spread (copy + override)
const [first, ...rest] = array;               // Rest (collect remaining)
function sum(...numbers) { }                  // Rest parameters

// 5. Template Literals
const msg = `Note "${title}" created at ${new Date()}`;

// 6. Optional Chaining & Nullish Coalescing
const city = user?.address?.city ?? "Unknown";  // Safe access + default

// 7. Modules (ESM - your project uses "type": "module")
export const helper = () => {};    // Named export
export default class Note {};      // Default export
import { helper } from "./utils.js";
import Note from "./models/Note.js";
```

### Async JavaScript - Critical for Backend
```javascript
// Promise Basics
const promise = new Promise((resolve, reject) => {
  // async work
  if (success) resolve(data);
  else reject(error);
});

// Async/Await (syntactic sugar over promises)
async function fetchNotes() {
  try {
    const notes = await Note.find();  // Pauses until promise resolves
    return notes;
  } catch (error) {
    throw error;  // Re-throw to let caller handle
  }
}

// Parallel vs Sequential
const [users, notes] = await Promise.all([
  User.find(),
  Note.find()
]);  // Runs in PARALLEL (faster)

const user = await User.findById(id);    // Sequential
const notes = await Note.find({ user }); // Waits for user first
```

### Node.js Essentials
```javascript
// process.env - Environment variables
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI;

// __dirname alternative in ESM
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Package.json scripts
"scripts": {
  "dev": "nodemon src/server.js",   // Auto-restart on changes
  "start": "node src/server.js"     // Production
}
```

---

## 🎯 SECTION 2: HTTP & REST API Fundamentals

### HTTP Methods & Their Meanings
| Method | Purpose | Idempotent? | Body? |
|--------|---------|-------------|-------|
| **GET** | Retrieve resource | ✅ Yes | ❌ No |
| **POST** | Create new resource | ❌ No | ✅ Yes |
| **PUT** | Full replace resource | ✅ Yes | ✅ Yes |
| **PATCH** | Partial update | ❌ No* | ✅ Yes |
| **DELETE** | Remove resource | ✅ Yes | ❌ No |

*Technically PATCH can be idempotent but often isn't in practice

### Status Codes You'll Use Daily
```javascript
// Success
200  // OK - GET, PUT, PATCH, DELETE success
201  // Created - POST success (include Location header)
204  // No Content - DELETE success (no response body)

// Client Errors
400  // Bad Request - Validation failed, malformed JSON
401  // Unauthorized - Missing/invalid token
403  // Forbidden - Authenticated but not allowed
404  // Not Found - Resource doesn't exist
422  // Unprocessable Entity - Validation errors (WebDAV but common)

// Server Errors
500  // Internal Server Error - Unhandled exception
503  // Service Unavailable - DB down, maintenance
```

### Request Parts
```
GET /api/notes/123?page=1&limit=10
├── Method: GET
├── Path: /api/notes/123
├── Params: { id: "123" }        → req.params.id
├── Query: { page: "1", limit: "10" } → req.query.page
├── Headers: Authorization, Content-Type
└── Body: (empty for GET)

POST /api/notes
└── Body: { title: "Hi", content: "There" } → req.body (needs express.json())
```

### RESTful URL Design
```
Collection:     GET    /api/notes          → Get all
                POST   /api/notes          → Create one

Single Item:    GET    /api/notes/:id      → Get one
                PUT    /api/notes/:id      → Full update
                PATCH  /api/notes/:id      → Partial update
                DELETE /api/notes/:id      → Delete one

Nested:         GET    /api/users/:id/notes → User's notes
```

---

## 🎯 SECTION 3: Express.js Core Concepts

### Basic Server Setup
```javascript
import express from 'express';
const app = express();

// Middleware (runs in ORDER)
app.use(express.json());           // Parse JSON bodies → req.body
app.use(express.urlencoded({ extended: true })); // Parse form data

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route with params
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
```

### Express Router (Modular Routes)
```javascript
// routes/notes.js
import express from 'express';
const router = express.Router();

router.get('/', getAllNotes);
router.post('/', createNote);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;

// In server.js
import notesRoutes from './routes/notes.js';
app.use('/api/notes', notesRoutes);  // Mount at /api/notes
```

### Request & Response Objects
```javascript
// req (Request)
req.params       // Route parameters: /:id → { id: "123" }
req.query        // Query string: ?page=1 → { page: "1" }
req.body         // Parsed body (needs middleware)
req.headers      // Headers object
req.method       // HTTP method
req.path         // Path portion of URL
req.ip           // Client IP

// res (Response)
res.status(200)          // Set status code (chainable)
res.json({ data })       // Send JSON (sets Content-Type)
res.send('text')         // Send string
res.sendStatus(404)      // Status + default message
res.set('Header', 'val') // Set header
res.cookie('name', 'val') // Set cookie
res.redirect('/login')   // Redirect
```

### Middleware Pattern
```javascript
// Custom middleware: (req, res, next) => {}
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();  // Pass to next middleware/route
};

app.use(logger);  // Global middleware

// Route-specific middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Error middleware: (err, req, res, next) => {}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
```

---

## 🎯 SECTION 4: MongoDB & Mongoose Fundamentals

### Key Concepts
```
Database (notes_db)
  └── Collection (notes)  ← Like SQL table
        └── Document      ← Like SQL row (JSON/BSON)
              ├── _id: ObjectId("507f1f77bcf86cd799439011")  ← Auto-generated
              ├── title: "My Note"
              ├── content: "Content here"
              ├── tags: ["work", "important"]
              ├── createdAt: ISODate("2024-01-15T10:30:00Z")
              └── updatedAt: ISODate("2024-01-15T10:30:00Z")
```

### Mongoose Schema vs Model
```javascript
import mongoose from 'mongoose';

// 1. SCHEMA - Blueprint/Structure
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  tags: [String],              // Array of strings
  isPinned: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Reference
}, {
  timestamps: true,            // Adds createdAt, updatedAt automatically
  versionKey: false            // Removes __v field
});

// 2. MODEL - Interface to database
const Note = mongoose.model('Note', noteSchema);  // Collection: "notes" (plural, lowercase)
export default Note;
```

### Schema Types & Options
```javascript
const schema = new mongoose.Schema({
  // Basic types
  name: String,
  age: Number,
  isActive: Boolean,
  createdAt: Date,
  
  // Special types
  _id: mongoose.Schema.Types.ObjectId,  // Explicit (usually auto)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference
  data: mongoose.Schema.Types.Mixed,    // Any type
  
  // Arrays
  tags: [String],
  scores: [Number],
  items: [{ name: String, qty: Number }],  // Array of subdocuments
  
  // Validation
  email: {
    type: String,
    required: true,
    unique: true,              // Creates unique index
    lowercase: true,
    match: /^\S+@\S+\.\S+$/   // Regex validation
  },
  age: { type: Number, min: 0, max: 150 },
  status: { type: String, enum: ['active', 'inactive', 'pending'] },
  
  // Custom validator
  password: {
    type: String,
    validate: {
      validator: v => v.length >= 8,
      message: 'Password must be 8+ chars'
    }
  }
});
```

---

## 🎯 SECTION 5: Mongoose CRUD Operations (Cheat Sheet)

### CREATE
```javascript
// Method 1: new + save() - Use when you need pre-save hooks
const note = new Note({ title: 'Hello', content: 'World' });
await note.save();

// Method 2: create() - Single or multiple
const note = await Note.create({ title: 'Hello', content: 'World' });
const notes = await Note.create([{ title: 'A' }, { title: 'B' }]);

// Returns: Saved document WITH _id, createdAt, updatedAt
```

### READ
```javascript
// Find all (with options)
const notes = await Note.find()                          // All
  .sort({ createdAt: -1 })                              // Newest first (1=asc, -1=desc)
  .skip(0)                                              // Pagination skip
  .limit(10)                                            // Pagination limit
  .select('title createdAt')                            // Include only these
  .select('-content')                                   // Exclude content
  .populate('author', 'name email');                    // Populate reference

// Find with filter
const notes = await Note.find({ 
  isPinned: true,
  tags: 'important',                                    // Array contains
  createdAt: { $gte: startDate, $lte: endDate }        // Date range
});

// Find ONE
const note = await Note.findById('507f1f77bcf86cd799439011');  // By _id
const note = await Note.findOne({ title: 'Hello' });            // First match

// Check existence (faster, returns null or { _id })
const exists = await Note.exists({ _id: id });

// Count
const total = await Note.countDocuments({ isPinned: true });
```

### UPDATE
```javascript
// Find by ID and update (returns UPDATED doc with { new: true })
const note = await Note.findByIdAndUpdate(
  id,
  { title: 'New Title', content: 'New Content' },
  { 
    new: true,              // Return updated doc (not old)
    runValidators: true     // Run schema validators
  }
);

// Find one and update
const note = await Note.findOneAndUpdate(
  { title: 'Old Title' },
  { $set: { title: 'New Title' } },                     // MongoDB operators
  { new: true }
);

// Atomic operators (use with update methods)
{ 
  $set: { field: value },           // Set value
  $unset: { field: "" },            // Remove field
  $inc: { count: 1 },               // Increment number
  $push: { tags: 'new' },           // Add to array
  $pull: { tags: 'old' },           // Remove from array
  $addToSet: { tags: 'unique' }     // Add if not exists
}
```

### DELETE
```javascript
// Find by ID and delete
const note = await Note.findByIdAndDelete(id);

// Find one and delete
const note = await Note.findOneAndDelete({ title: 'Hello' });

// Delete many
const result = await Note.deleteMany({ isPinned: false });
// result: { acknowledged: true, deletedCount: 5 }

// Returns: Deleted document (or null if not found)
```

---

## 🎯 SECTION 6: Error Handling Patterns

### Try/Catch in Controllers
```javascript
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false, 
        message: 'Note not found' 
      });
    }
    
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    // Handle specific Mongoose errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    // Generic server error
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
```

### Async Handler Wrapper (Removes try/catch repetition)
```javascript
// middleware/asyncHandler.js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Usage
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({ success: true, data: notes });
  // Errors automatically passed to error middleware!
});
```

---

## 🎯 SECTION 7: Your Current Project - Concept Mapping

### What You've Built (Map to Concepts)
| Your File | Concepts Demonstrated |
|-----------|----------------------|
| `server.js` | Express app, middleware (`express.json()`), route mounting, env vars |
| `config/db.js` | Mongoose connection, async/await, error handling, process.exit |
| `models/Note.js` | Schema definition, types, required, timestamps, model creation |
| `routes/notesRoutes.js` | Router, HTTP methods, route params (`:id`), controller binding |
| `controller/notesController.js` | Async functions, `Note.find()`, `Note.create()`/`.save()`, status codes |

### What's Missing in Your Controller (Fix These)
```javascript
// CURRENT ISSUES:
export async function UpdateNode(req,res){  // ❌ Broken
    const {title,content} = req.body
    await Note = new Note({title,content})  // Wrong! This creates NEW, doesn't update
}

export function Deletenode(req,res){        // ❌ Incomplete
    res.status(200).json({Message:"Deleted"})  // Doesn't actually delete!
}

// MISSING: GET single note by ID
// export async function getNoteById(req, res) { ... }
```

### Correct Implementations
```javascript
// UPDATE - Find existing by ID, modify, save
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE - Actually remove from database
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE - Fetch by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 🎯 SECTION 8: Next Concepts to Learn (Priority Order)

### Immediate (Fix Current Code)
1. ✅ `Note.findById(id)` - Get single document
2. ✅ `Note.findByIdAndUpdate(id, data, options)` - Update by ID
3. ✅ `Note.findByIdAndDelete(id)` - Delete by ID
4. ✅ Proper error handling for `CastError` (invalid ObjectId)

### Before Next Tutorial Section
5. **Input Validation** - `express-validator` or `zod`
6. **Error Handling Middleware** - Centralized, clean controllers
7. **Pagination** - `skip()` + `limit()` with query params
8. **Query Filtering/Search** - `$text` search, field filters

### Soon After
9. **Authentication** - JWT tokens, bcrypt password hashing
10. **User Model & References** - `ref: 'User'`, `.populate()`
11. **Middleware** - Auth protection, rate limiting
12. **Environment Config** - Separate dev/prod configs

---

## 📋 QUICK REFERENCE CARD

### Mongoose Methods
```
Create:     Note.create(data) / new Note(data).save()
Read All:   Note.find(filter).sort().skip().limit().select().populate()
Read One:   Note.findById(id) / Note.findOne(filter)
Update:     Note.findByIdAndUpdate(id, data, { new: true, runValidators: true })
Delete:     Note.findByIdAndDelete(id) / Note.findOneAndDelete(filter)
Count:      Note.countDocuments(filter)
Exists:     Note.exists(filter)
```

### Express Response Helpers
```javascript
res.status(200).json({ success: true, data })
res.status(201).json({ success: true, data, message: 'Created' })
res.status(400).json({ success: false, message: 'Bad Request' })
res.status(404).json({ success: false, message: 'Not Found' })
res.status(500).json({ success: false, message: 'Server Error' })
```

### Common Mongoose Errors
```javascript
error.name === 'CastError'        // Invalid ObjectId format
error.name === 'ValidationError'  // Schema validation failed
error.code === 11000              // Duplicate key (unique index)
error.name === 'VersionError'     // Document version conflict
```

---

## 🎓 Study Tips for Your Tutorial

1. **Pause the video** when they introduce a new method → look it up here
2. **Type the code yourself** - don't just copy/paste
3. **Break things intentionally** - see what errors look like
4. **Use `console.log()`** everywhere to understand data flow
5. **Read Mongoose docs** for every method you use: `mongoosejs.com/docs/api.html`

---

## 🔗 Essential Documentation Links
- **Express.js:** https://expressjs.com/en/4x/api.html
- **Mongoose:** https://mongoosejs.com/docs/guide.html
- **MongoDB Operators:** https://www.mongodb.com/docs/manual/reference/operator/
- **HTTP Status Codes:** https://httpstatuses.com/
- **REST API Design:** https://restfulapi.net/

---

*Keep this guide open while following your tutorial. Refer to sections as new concepts appear!* 🚀