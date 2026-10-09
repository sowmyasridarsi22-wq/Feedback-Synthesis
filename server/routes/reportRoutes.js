import {Router} from 'express';import {exportCSV,exportPDF} from '../controllers/reportController.js';const r=Router();r.get('/csv',exportCSV);r.get('/pdf',exportPDF);export default r;
