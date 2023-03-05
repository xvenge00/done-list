import { date } from 'yup';

export async function match(value: string): Promise<boolean> {
	// return /^[0-9a-f]{6}$/.test(value);
    try {
        await date().required().validate(value);
        return true;
    } catch(e: any) {
        return false;
    }
}
