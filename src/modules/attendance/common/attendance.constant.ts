export enum AttendanceResult {
    EARLY = "Early",
    IN_TIME = "In time",
    LATE = "Late",
}

export enum AttendanceType {
    NONE = "None",
    IN = "In",
    OUT = "Out",
}

export enum AttendanceErrorCode {
    BAD_REQUEST_INVALID_OTP = "BAD_REQUEST_INVALID_OTP",
    BAD_REQUEST_INVALID_BSSID = "BAD_REQUEST_INVALID_BSSID",
    BAD_REQUEST_INVALID_TYPE = "BAD_REQUEST_INVALID_TYPE",
}