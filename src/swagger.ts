import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Task Management API')
  .setDescription('Use the base API URL as http://localhost:3000')
  .setTermsOfService('http://localhost:3000/terms-of-service')
  .setLicense(
    'MIT License',
    'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
  )
  .addServer('http://localhost:3000')
  .setVersion('1.0')
  .build();
