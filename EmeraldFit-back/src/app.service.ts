import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  testConnection(): { message: string; timestamp: string } {
    return {
      message: '🎉 Conexão estabelecida com sucesso! Backend EmeraldFit está funcionando!',
      timestamp: new Date().toISOString(),
    };
  }
}
