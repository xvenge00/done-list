import type { Session } from "@auth/core/types";


export function isAuthenticated(session: Session|null): boolean {
    if (!session || !session.user || !session.user.email) {
        return false;
    }
    return true;
}