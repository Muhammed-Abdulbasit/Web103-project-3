import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cors from 'cors';

// import the routers for events and locations
import eventsRouter from './routes/eventsRoutes.js';
import locationsRouter from './routes/locationsRoutes.js';


const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve favicon depending on environment
if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'party.png')));
} else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'party.png')));
    app.use(express.static('public'));
}

// specify the api path for the server to use
app.use('/api/events', eventsRouter);
app.use('/api/locations', locationsRouter);

// Optional root route
app.get('/', (req, res) => {
    res.send('Virtual Community Space API is running');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    );
}

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});
