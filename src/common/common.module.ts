import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { CloudinaryProvider } from './config/cloudinary.provider';
import { MemcacheService } from './cache/memcache.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, MemcacheService],
  exports: [CloudinaryProvider, CloudinaryService, MemcacheService],
})
export class CommonModule {}
