function log(level: string, args: any[]) {
	const date = new Date().toUTCString();
	const content = args.map((arg) => arg.toString()).join(' ');
	console.log(`${date} ${level}: ${content}`);
}

export function info(...args: any) {
	log('info', args);
}

export function warning(...args: any) {
	log('warning', args);
}

export function error(...args: any) {
	log('error', args);
}
