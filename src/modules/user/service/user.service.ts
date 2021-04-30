import { TrangThaiRequestIdentity } from './../common/user.constant';
import { RequestIdentityDocument } from './../entities/request-identity.entity';
import { DB_REQUEST_IDENTITY } from './../../repository/db-collection';
import { AccessibleModel } from "@casl/mongoose";
import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { info } from "console";
import { DocumentQuery, Model, mongo } from "mongoose";
import { CommonResultDto } from "../../../common/dto/common-result.dto";
import { PageableDto } from "../../../common/dto/pageable.dto";
import { ErrorData } from "../../../common/exception/error-data";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { JwtPayload } from "../../auth/dto/jwt-payload";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { DB_USER } from "../../repository/db-collection";
import { UserAbilityFactory } from "../common/user.ability";
import { UserErrorCode } from "../common/user.constant";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { IdentifyDeviceDto } from "../dto/identify-device.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserPageableDto } from "../dto/user-pageable.dto";
import { UserDocument } from "../entities/user.entity";
@Injectable()
export class UserService {

  constructor(
    @InjectModel(DB_USER)
    private readonly userModel: AccessibleModel<UserDocument>,
    @InjectModel(DB_REQUEST_IDENTITY)
    private readonly requestIdentityModel: Model<RequestIdentityDocument>,

    private readonly userAbilityFactory: UserAbilityFactory,
    private readonly jwtService: JwtService,
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userModel
      .create(createUserDto);
  }

  findById(id: string): DocumentQuery<UserDocument, UserDocument> {
    return this.userModel
      .findById(id);
  }

  async findPageable(conditions: any, option: FetchQueryOption): Promise<UserPageableDto> {
    const total = this.userModel.countDocuments(conditions);
    const result = this.userModel
      .find(conditions)
      .setOptions(option)
      .select("-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo");
    return Promise.all([total, result]).then(p => PageableDto.create(option, p[0], p[1]));
  }

  userFindAll(user: UserDocument) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
      .find()
      .select("-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo");
  }

  userFindById(user: UserDocument, id: string) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
      .findOne({ _id: id });
  }

  async userUpdateById(user: UserDocument, id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "update")
      .findOne({ _id: id });
    if (updateUser) {
      Object.assign(updateUser, updateUserDto);
      return updateUser.save();
    }
    return null;
  }

  userDeleteById(user: UserDocument, id: string) {
    return this.userModel
      .accessibleBy(this.userAbilityFactory.createForUser(user), "delete")
      .findOneAndRemove({ _id: id });
  }

  async identifyDevice(user: UserDocument, identifyInfo: IdentifyDeviceDto): Promise<CommonResultDto> {
    if (!user.clientDeviceId) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID,
      );
    }
    if (user.identifiedDeviceInfo) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_DEVICE_IDENDIFIED,
      );
    }
    const existsDeviceId = await this.userModel
      .exists({ "identifiedDeviceInfo.deviceId": user.clientDeviceId });
    if (existsDeviceId) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_CLIENT_DEVICE_ID_EXIST,
      );
    }
    const matchPassword: boolean = await user.comparePassword(identifyInfo.password);
    if (matchPassword) {
      user.identifiedDeviceInfo = {
        deviceId: user.clientDeviceId,
        identifiedAt: new Date(),
      };
      user.save();
      return { success: true, message: "OK" };
    } else {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_DEVICE_IDENDIFIED,
      );
    }
  }

  async changePassword(user: UserDocument, changePassword: ChangePasswordDto): Promise<LoginResultDto> {
    const correctOldPassword = await user.comparePassword(changePassword.oldPassword);
    if (!correctOldPassword) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD,
      );
    }
    if (changePassword.newPassword === changePassword.oldPassword) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD,
      );
    }
    user.password = changePassword.newPassword;
    await user.save();
    const payload: JwtPayload = {
      sub: {
        userId: user._id,
        authorizationVersion: user.authorizationVersion.version + 1,
        platform: user.clientPlatform,
      },
      jti: new mongo.ObjectId().toHexString(),
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async sendRequestChangeIdentity(user: UserDocument): Promise<any> {
    if (!user.identifiedDeviceInfo.deviceId) {
      throw ErrorData.init(
        HttpStatus.BAD_REQUEST,
        UserErrorCode.BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID,
      );
    }
    const docs: RequestIdentityDocument = {
      idUserRequest: user._id,
      trangThai: TrangThaiRequestIdentity.PROCESSING,
    } as any;
    const data = await this.requestIdentityModel.create(docs);
    return { success: true, message: "OK" };
  }

  async getRequestChangeIdentity(): Promise<any> {
    return this.requestIdentityModel.find({ trangThai: TrangThaiRequestIdentity.PROCESSING });
  }

  async process(idRequest: string): Promise<any> {
    const request = await this.requestIdentityModel.findById(idRequest);
    request.trangThai = TrangThaiRequestIdentity.ACCEPTED;
    await request.save();
    await this.userModel.updateOne({ _id: request.idUserRequest }, { $unset: { identifiedDeviceInfo: 1 } });
    return { success: true, message: "OK" };
  }

  async testRemove(user: UserDocument) {
    return this.userModel.updateOne({ _id: user._id }, { $unset: { identifiedDeviceInfo: 1 } });
  }
}
