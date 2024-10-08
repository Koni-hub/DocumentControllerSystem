import express from 'express';
import database from "./config/dbConfig.js";
import cors from 'cors';
import AccountRoutes from './routes/accountRoutes.js';
import DocumentRoutes from './routes/documentRoutes.js';
import RejectDocumentsRoutes from './routes/rejectDocumentsRoutes.js';
import RegistryRoutes from './routes/registryRoutes.js';
import AuditLog from './routes/auditRoutes.js';
import session from "express-session";

// Setup Accounts
import AuthRoutes from './routes/authGoogle.js';
import passportSetup from './passport.js';
import "dotenv/config"

const app = express();

//Database Connection

const port = 5000;

try {
    await database.authenticate();
    console.log("Successfully Connected to the database");
    console.log
} catch (error) {
    console.log("Failed to connect!", error);
}

app.use(session({
    name: 'session',
    keys: ['DocumentControllerSystem'],
    secret: 'documentsystem',
    maxAge: 24 * 60 * 60 * 1000,
    cookie: { secure: false },
    resave: false,
    saveUninitialized: false
}));

app.use(passportSetup.initialize());
app.use(passportSetup.session());

// Middleware setup
app.use(cors({
    origin: ["http://localhost:5173", "https://documentcontrollersystem.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());

app.use('/', AccountRoutes);
app.use('/documents', DocumentRoutes);
app.use('/rejected-documents', RejectDocumentsRoutes);
app.use('/registry', RegistryRoutes);
app.use('/audit-logs', AuditLog);
app.use('/auth', AuthRoutes);

// Check Health
app.get('/health', (_req, res) => res.status(200).send("OK"));

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});