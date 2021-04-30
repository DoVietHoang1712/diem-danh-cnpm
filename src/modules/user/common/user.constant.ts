export enum SystemRole {
    ADMIN = "Admin",
    USER = "User",
    GUEST = "Guest",
}

export enum UserErrorCode {
    BAD_REQUEST_DEVICE_IDENDIFIED = "BAD_REQUEST_DEVICE_IDENDIFIED",
    BAD_REQUEST_WRONG_PASSWORD = "BAD_REQUEST_WRONG_PASSWORD",
    BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID = "BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID",
    BAD_REQUEST_CLIENT_DEVICE_ID_EXIST = "BAD_REQUEST_CLIENT_DEVICE_ID_EXIST",
    BAD_REQUEST_WRONG_OLD_PASSWORD = "BAD_REQUEST_WRONG_OLD_PASSWORD",
    BAD_REQUEST_DUPLICATE_NEW_PASSWORD = "BAD_REQUEST_DUPLICATE_NEW_PASSWORD",
}

export enum TrangThaiRequestIdentity {
    PROCESSING = "PROCESSING",
    ACCEPTED = "ACCEPTED",
}