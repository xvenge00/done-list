import { env } from '$env/dynamic/public';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function log(level: string, args: any[]) {
	const date = new Date().toUTCString();
	const content = args.map((arg) => arg.toString()).join(' ');
	console.log(`${date} ${level}: ${content}`);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function debug(...args: any) {
	if (env.PUBLIC_IS_DEV ?? false) {
		log('debug', args);
	}
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function info(...args: any) {
	log('info', args);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function warning(...args: any) {
	log('warning', args);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function error(...args: any) {
	log('error', args);
}
