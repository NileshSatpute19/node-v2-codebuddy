import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const timeTakenByRoute = Date.now() - start;
      const httpCode = res.statusCode;
      console.log(
        `${method} ${originalUrl} ${httpCode} ${timeTakenByRoute} ms`,
      );
    });

    next();
  }
}
