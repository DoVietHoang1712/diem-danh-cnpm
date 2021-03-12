export enum Environment {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
}

export interface Configuration {
    server: {
        port: number,
        environment: Environment;
    };
    database: {
        host: string,
        port: number,
        username?: string,
        password?: string,
        name: string,
    };
    jwt: {
        secret: string,
        exp: number,
    };
}

export default (): Configuration => ({
    server: {
        port: parseInt(process.env.SERVER_PORT, 10) || 3000,
        environment: process.env.NODE_ENV as Environment,
    },
    database: {
        host: encodeURI(process.env.DB_HOST),
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        exp: process.env.JWT_EXP && parseInt(process.env.JWT_EXP, 10),
    },
});