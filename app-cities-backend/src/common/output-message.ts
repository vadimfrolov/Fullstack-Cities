import { HttpStatus, HttpException } from "@nestjs/common";

export function commonResponse(success: boolean, message: string, payload: any = null) {
    if (success) {
        return { success, message, data: payload };
    } else {
        let httpStatus = HttpStatus.BAD_REQUEST;
        if (payload.status === HttpStatus.UNAUTHORIZED) {
            httpStatus = HttpStatus.UNAUTHORIZED;
        } else if (payload.status === HttpStatus.NOT_ACCEPTABLE) {
            httpStatus = HttpStatus.NOT_ACCEPTABLE;
        }

        throw new HttpException(
            {
                success,
                message: payload.message || message,
                error: payload.message,
            },
            httpStatus,
        );
    }
}
