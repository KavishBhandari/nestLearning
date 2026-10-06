import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { userInterface } from '../database/Interface/userInterface';

import { userAddressInterface } from '../database/Interface/userAddressInterface.';
import { authTokenInterface } from '../database/Interface/authTokenInterface.';
import { messages, roles } from '../utils/constant';
import { userImage } from '../database/Interface/userImage';
import commonHelper from '../helpers/commonHelper.';
import models from '../utils/modelName';
import { RoleInterface } from '../database/Interface/roleInterface';
import { authPayloadInterface } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel("User")
    private readonly userModel: Model<userInterface>,

    @InjectModel("UserAddrress")
    private readonly userAddresssModel: Model<userAddressInterface>,

    @InjectModel("UserAuthToken")
    private readonly userAuthTokenModel: Model<authTokenInterface>,

    @InjectModel("UserImage")
    private readonly userImageModel: Model<userImage>,

    @InjectModel(models.Role)
    private readonly roleModel: Model<RoleInterface>,


  ) { }

  public async getCustomerRole() {
    const getCustomerId = await this.roleModel.findOne({
      roleName: roles.CUSTOMER
    }).select("_id");
    if (!getCustomerId) {
      throw new HttpException(messages.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return getCustomerId._id;
  };

  async signup(createAuthDto: CreateAuthDto, fileName: string) {
    const customerId = await this.getCustomerRole();
    const user = await this.userModel.create({
      ...createAuthDto,
      roleId: new mongoose.Types.ObjectId(customerId)
    });
    await this.userAddresssModel.create({
      city: createAuthDto.city,
      address: createAuthDto.address,
      userId: user._id
    });
    const userProfilePic = `http://localhost:3000/public/userProfiePic/${fileName}`;
    console.log("userProfilePic :::::::::", userProfilePic);
    await this.userImageModel.create({
      userId: user.id,
      profilepic: userProfilePic
    });
    return user
  };

  isUserAlreadyExist = async (email: string) => {
    const user = await this.userModel.findOne({
      email: email
    }).select("email");

    if (user) {
      throw new HttpException(
        messages.ACCOUNT_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST
      );
    }
    return;
  };

  isUserValid = async (email: string) => {
    const user = await this.userModel.findOne({
      email: email
    }).select("_id name email password roleId");
    if (!user) {
      throw new HttpException(
        messages.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST
      );
    }
    return user;
  };

  storeAuthToken = async (userId: mongoose.Types.ObjectId, accessToken: string, refreshToken: string) => {
    return await this.userAuthTokenModel.create({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId
    });
  };

  getUserProfile = async (query: { page: string, limit: string, search?: string, sortBy: string, sortOrder: string }) => {

    const getPagination = commonHelper.getPagination(
      query
    );

    console.log("getPagination.limit::::::", getPagination.limit);
    console.log("getPagination.offset::::::", getPagination.offset)

    let pipeline: mongoose.PipelineStage[] = [];

    pipeline = [
      {
        $lookup: {
          from: "useraddrresses",//UserAddrress
          localField: "_id",
          foreignField: "userId",
          as: "userAddress"
        }
      },
      {
        $lookup: {
          from: "userimages",
          localField: "_id",
          foreignField: "userId",
          as: "userImage"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          "userAddress.city": 1,
          "userAddress.address": 1,
          "userAddress.userId": 1,
          "userImage.profilepic": 1
        }
      },
    ];

    if (query.search) {
      pipeline.push({
        $match: {
          $or: [
            {
              name: {
                $regex: query.search,
                $options: 'i',
              },
            },
            {
              email: {
                $regex: query.search,
                $options: 'i',
              },
            },
            {
              'userAddress.city': {
                $regex: query.search,
                $options: 'i',
              }
            },
            {
              'userAddress.address': {
                $regex: query.search,
                $options: 'i',
              }
            }
          ],
        },
      });
    }

    if (query.sortBy) {
      const sortOrder = query.sortOrder === "desc" ? -1 : 1;
      pipeline.push({
        $sort: { [query.sortBy]: sortOrder }
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $skip: getPagination.offset },
          { $limit: getPagination.limit },
        ],
        totalCount: [{ $count: 'count' }],
      },
    });

    const userProfile = await this.userModel.aggregate(pipeline);
    console.log("userProfile :::::::::", userProfile);

    const totalRecord = userProfile[0]?.totalCount[0]?.count || 0;
    const data = userProfile[0]?.data;
    const pagination = commonHelper.createPagination(
      totalRecord,
      parseInt(query.page),
      getPagination.limit
    );

    return {
      data,
      pagination: pagination
    };
  };

  getOwnProfile = async (user: authPayloadInterface) => {
    let pipeline: mongoose.PipelineStage[] = [];
    pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user._id)
        }
      },
      {
        $lookup: {
          from: "useraddrresses",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            { $match: { deleted_at: null } },
            //{ $project: { _id: 0, city: 1, address: 1, userId: 1 } }
          ],
          as: "userAddress"
        }
      },
      {
        $lookup: {
          from: "userimages",
          localField: "_id",
          foreignField: "userId",
           pipeline: [
            { $match: { deleted_at: null } },
            //{ $project: { _id: 0, city: 1, address: 1, userId: 1 } }
          ],
          as: "userImage"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          "userAddress.city": 1,
          "userAddress.address": 1,
          "userAddress.userId": 1,
          "userImage.profilepic": 1
        }
      },
    ];

    return await this.userModel.aggregate(pipeline);

  };

  /*getUserProfile = async (
    query: {
      page: string;
      limit: string;
      search?: string;
    },
  ) => {
    const getPagination = commonHelper.getPagination(query);

    const pipeline: mongoose.PipelineStage[] = [];

    // Search
    if (query.search) {
      pipeline.push({
        $match: {
          $or: [
            {
              name: {
                $regex: query.search,
                $options: 'i',
              },
            },
            {
              email: {
                $regex: query.search,
                $options: 'i',
              },
            },
            {
              'userAddress.city': {
                $regex: query.search,
                $options: 'i',
              }
            }
          ],
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "useraddrresses",//UserAddrress
          localField: "_id",
          foreignField: "userId",
          as: "userAddress"
        }
      },
      {
        $lookup: {
          from: "userimages",
          localField: "_id",
          foreignField: "userId",
          as: "userImage"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          'userAddress.city': 1,
          'userAddress.address': 1,
          'userImage.profilepic': 1,
        },
      },
      {
        $facet: {
          data: [
            { $skip: getPagination.offset },
            { $limit: getPagination.limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    );

    const userProfile = await this.userModel.aggregate(pipeline);

    const totalRecord =
      userProfile[0]?.totalCount[0]?.count || 0;

    const data = userProfile[0]?.data || [];

    const pagination = commonHelper.createPagination(
      totalRecord,
      Number(query.page),
      getPagination.limit,
    );

    return {
      data,
      pagination,
    };
  };*/



  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
