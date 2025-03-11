import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    apiCheck(): string {
        return 'API Working!!';
    }
}
