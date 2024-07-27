/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { appConstant } from '../constant/app.constant';
const NodeCache = require('node-cache');
@Injectable()
export class MemcacheService {
  private myCache: any;
  constructor() {
    this.myCache = new NodeCache({
      stdTTL: appConstant.REDIS.MODE.REDIS_DURATION,
      checkperiod: 120,
      useClones: false,
      deleteOnExpire: true,
    });
  }

  async set(
    key,
    value: string | boolean | number | any,
    duration = appConstant.REDIS.MODE.REDIS_DURATION,
  ) {
    return await this.myCache.set(key, value, duration);
  }

  async get(key: string): Promise<string | boolean | number | any> {
    if (key !== null && key !== undefined && key !== 'undefined') {
      return await this.myCache.get(key);
    }
  }

  async delete(key: string) {
    if (key !== null && key !== undefined && key !== 'undefined') {
      return await this.myCache.del(key);
    }
  }
}
