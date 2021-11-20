import { to } from "await-to-js";
import { DeepPartial, IsNull, Repository } from "typeorm";
import { IResponse, IResponseAll } from "../types";
import { Request } from "express";
import { Req } from "@nestjs/common";
import * as _ from "lodash";

export class BaseService<T> {
  constructor(
    public repo: Repository<T>,
    private relations?: Array<string>
  ) { }

  public async getAll(@Req() req: Request): Promise<IResponseAll<T>> {
    let filter = {
      ...(this.relations ? { relations: this.relations } : {}),
      ...(req.query.offset ? { skip: +req.query.offset } : {}),
      ...(req.query.limit ? { take: +req.query.limit } : {}),
      order: {
        id: "ASC"
      },
      where: {
        deletedAt: IsNull()
      }
    }
    _(req.query).map((f, key) => {
      let commands = key.split("__");
      if (commands.length == 1) {
        if (!['offset', 'limit'].find(c => c == key)) {
          filter.where[key] = f;
        }
      } else {
        switch (commands[1]) {
          case 'isnull':
            if (f.toLowerCase() == 'true') {
              filter.where[commands[0]] = IsNull();
            }
            break;
        }
      }
    }).value()
    const [err, results] = await to(this.repo.find(filter));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponseAll<T>;
    }

    return {
      status: 200,
      message: "ok",
      results: (results as T[]),
    };
  }

  public async get(req: Request, id: number): Promise<IResponse<T>> {
    const [err, result] = await to(
      this.repo.findOne({
        ...(this.relations ? { relations: this.relations } : {}),
        where: {
          id,
          deletedAt: IsNull(),
        },

      })
    );
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<T>;
    }

    return {
      status: 200,
      message: "ok",
      result,
    };
  }

  public async post(req: Request, entity: T): Promise<IResponse<T>> {
    (entity as any).insertedAt = new Date()
    if (this.relations) {
      for (const key in entity) {
        if (Object.prototype.hasOwnProperty.call(entity, key)) {
          if (this.relations.includes(key)) {
            delete entity[key];
          }
        }
      }
    }
    const [err, result] = await to(this.repo.save(entity));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<T>;
    }

    return {
      status: 201,
      message: "ok",
      result,
    };
  }

  public async put(req: Request, id: number, entity: T): Promise<IResponse<T>> {
    (entity as any).insertedAt = new Date()
    let [err, results] = await to(this.get(req, id));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<T>;
    }

    let data: T;
    if (results?.result) {
      data = results?.result;
      for (const key in entity) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = entity[key];
          data[key] = entity[key]
        }
      }
    } else {
      return {
        status: 404,
        message: "not found record",
      } as IResponse<T>;
    }

    let res;
    (data as any).updatedAt = new Date();
    if (this.relations) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (this.relations.includes(key)) {
            delete data[key];
          }
        }
      }
    }
    [err, res] = await to(this.repo.update(id, data));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<T>;
    }

    if (res?.affected) {
      return {
        status: 200,
        message: "ok",
      };
    } else {
      return {
        status: 500,
        message: 'error !.',
      } as IResponse<T>;
    }
  }

  public async patch(req: Request, id: number, entity: T): Promise<IResponse<T>> {
    let [err, results] = await to(this.get(req, id));
    if (err) {
      return {
        status: 501,
        message: err.message,
      } as IResponse<T>;
    }

    let data: T;
    if (results?.result) {
      data = results?.result;
      for (const key in entity) {
        if (Object.prototype.hasOwnProperty.call(data, key) && entity[key]) {
          data[key] = entity[key]
        }
      }
    } else {
      return {
        status: 404,
        message: "not found record",
      } as IResponse<T>;
    }

    let res;
    (data as any).updatedAt = new Date();
    if (this.relations) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (this.relations.includes(key)) {
            delete data[key];
          }
        }
      }
    }
    [err, res] = await to(this.repo.update(id, data));
    if (err) {
      return {
        status: 502,
        message: err.message,
      } as IResponse<T>;
    }

    if (res?.affected) {
      return {
        status: 200,
        message: "ok",
      };
    } else {
      return {
        status: 503,
        message: 'error !.',
      } as IResponse<T>;
    }
  }

  public async delete(req: Request, id: number): Promise<IResponse<T>> {
    let [err, results] = await to(this.get(req, id));
    if (err) {
      return {
        status: 500,
        message: err.message,
      } as IResponse<T>;
    }

    let data: DeepPartial<T>;
    if (results?.result) {
      data = results?.result;
      (data as any).deletedAt = new Date();
      if (this.relations) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (this.relations.includes(key)) {
              delete data[key];
            }
          }
        }
      }
      let [errDelete, resultsDelete] = await to(this.repo.update(id, data));
      if (errDelete) {
        return {
          status: 500,
          message: "not found record",
        } as IResponse<T>;
      } else {
        return {
          status: 200,
          message: "ok",
        } as IResponse<T>;
      }

    } else {
      return {
        status: 404,
        message: "not found record",
      } as IResponse<T>;
    }
  }
}
