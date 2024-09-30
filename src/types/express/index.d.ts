export {};

declare global {
    namespace Express {
        export interface Request {
            isAuthorised: boolean;
            userId?: string;
            email?: string;
        }
    }
}
