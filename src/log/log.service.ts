import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DbLog } from "./log.entity";
import { CreateLogDto } from "./dtos/create-log.dto";

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(DbLog, "LogConnection")
    private logsRepository: Repository<DbLog>
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = this.logsRepository.create(log);

    await this.logsRepository.save(newLog, { data: { isCreatingLogs: true } });

    return newLog;
  }
}
