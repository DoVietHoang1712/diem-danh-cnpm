export class JwtPayload {
    sub: {
        userId: string;
        authorizationVersion: number;
        platform?: string;
        deviceId?: string;
    };
    jti: string;
}