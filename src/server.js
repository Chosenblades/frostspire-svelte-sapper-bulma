import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import uuidv4 from 'uuid/v4';
import helmet from 'helmet';
import dotenv from 'dotenv';
import session from 'cookie-session';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';

express()
	// Body parser
	.use(express.json())
	.use(cookieParser())
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
		session({
			name: 'token',
			keys: ['asdfasdfasdf', 'asdflkjasdf'],
			maxAge: 30 * 24 * 60 * 60 * 1000
		}),
		sapper.middleware({
			session: (req, res) => ({
				token: req.session.token
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});