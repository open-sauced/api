import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@supabase/supabase-js";

import { DbUser } from "./user.entity";

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(DbUser)
    private userRepository: Repository<DbUser>,
  ) {}

  baseQueryBuilder (): SelectQueryBuilder<DbUser> {
    const builder = this.userRepository.createQueryBuilder("users");

    return builder;
  }

  async findOneById (id: number): Promise<DbUser> {
    const queryBuilder = this.baseQueryBuilder();

    queryBuilder.where("id = :id", { id });

    let item: DbUser | null;

    try {
      item = await queryBuilder.getOne();
    } catch (e) {
      // handle error
      item = null;
    }

    if (!item) {
      throw (new NotFoundException);
    }

    return item;
  }

  async checkAddUser (user: User): Promise<DbUser> {
    const { user_metadata: { user_name }, identities } = user;
    const github = identities!.filter(identity => identity.provider === "github")[0];
    const id = parseInt(github.id, 10);

    try {
      return await this.findOneById(id);
    } catch (e) {
      // create new user
      const newUser = this.userRepository.create({
        id,
        is_open_sauced_member: false,
        login: user_name as string,
        created_at: (new Date),
        updated_at: new Date(github.updated_at ?? github.created_at),
      });

      await newUser.save();

      return newUser;
    }
  }

  async updateOnboarding (id: number) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, { is_onboarded: true, is_waitlisted: false });
    } catch (e) {
      throw new NotFoundException("Unable to update user onboarding status");
    }
  }

  async updateWaitlistStatus (id: number) {
    try {
      await this.findOneById(id);

      await this.userRepository.update(id, { is_waitlisted: true });
    } catch (e) {
      throw new NotFoundException("Unable to update user waitlist status");
    }
  }
}
