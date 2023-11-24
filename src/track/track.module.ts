/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { AlbumModule } from 'src/album/album.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([TrackEntity]),
    AlbumModule, // Import the AlbumModule here
  ],
  providers: [TrackService],
})
export class TrackModule {}
