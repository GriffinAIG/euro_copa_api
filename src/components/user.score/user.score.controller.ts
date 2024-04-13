import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserScoreService } from './user.score.service';
import { CreateUserScoreDto } from './dto/create-user.score.dto';
import { UpdateUserScoreDto } from './dto/update-user.score.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RateLimitGuard } from '../auth/rate.guard/rate.limit.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller("/api/v1/user-score")
@ApiTags("UserScore")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)

export class UserScoreController {
  constructor(private readonly userScoreService: UserScoreService) { }

  @Post()
  create(@Body() createUserScoreDto: CreateUserScoreDto) {
    return this.userScoreService.create(createUserScoreDto);
  }

  @Get()
  findAll() {
    return this.userScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserScoreDto: UpdateUserScoreDto) {
    return this.userScoreService.update(+id, updateUserScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userScoreService.remove(+id);
  }
}
