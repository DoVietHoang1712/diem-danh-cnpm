import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SettingKey } from "../common/setting.constant";
import { SettingDocument } from "../entities/setting.entity";
import { DB_SETTING } from "./../../repository/db-collection";
import { CreateSettingDTO } from "./../dto/create-setting.dto";

@Injectable()
export class SettingService {
    constructor(
        @InjectModel(DB_SETTING)
        private readonly settingModel: Model<SettingDocument>,
    ) { }

    async create(createSettingDto: CreateSettingDTO) {
        const setting = await this.settingModel.create(createSettingDto);
        return setting;
    }

    getSetting(key: SettingKey) {
        return this.settingModel.findOne({ key });
    }

    async getSettingValue<T = any>(key: SettingKey): Promise<T> {
        const res = await this.settingModel.findOne({ key });
        return res?.value;
    }

    async setSetting(data: CreateSettingDTO) {
        if (!await this.getSetting(data.key)) {
            const newSetting = await this.settingModel.findOneAndUpdate(
                { key: data.key },
                { $set: data },
                {
                    runValidators: true,
                    new: true,
                    upsert: true,
                }
            );
            return newSetting;
        } else {
            const newSetting = await this.settingModel.findOneAndUpdate(
                { key: data.key },
                { $set: data },
                {
                    runValidators: true,
                    new: true,
                    upsert: true,
                }
            );
            return newSetting;
        }
    }

}