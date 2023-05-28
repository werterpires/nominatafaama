import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

process.env.TZ = 'America/Sao_Paulo'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Desconsidera qualquer elemento adicional aos dados
      forbidNonWhitelisted: true,
      transform: true, // Faz a transformação dos params e query quando são numeros ou outras coisas
    }),
  )
  await app.listen(3000)
}
void bootstrap()
