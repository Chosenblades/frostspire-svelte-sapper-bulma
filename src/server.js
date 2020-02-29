import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import uuidv4 from 'uuid/v4';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';

express()
	.use((req, res, next) => {
		res.locals.nonce = uuidv4();
		next();
	})
	.use(helmet({
		contentSecurityPolicy: {
			directives: {
				scriptSrc: [
					"'self'", "'unsafe-eval'",
					(req, res) => `'nonce-${res.locals.nonce}'`
				]
			}
		}
	}))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});