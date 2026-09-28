import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role-dto';
import { messages } from '../utils/constant';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {

  }

  @Post("addRole")
  async addRole(@Body() roleDto: RoleDto) {
    const role = await this.roleService.addRole(roleDto.roleName);
    return {
      statusCode : HttpStatus.OK,
      message : messages.ROLE_CREATED_SUCCESS,
      data : {
        role
      }
    };
  };

  @Post("updateRole/:id")
  async updateRole(
    @Param("id") id: string,
    @Body() roleDto: RoleDto
  ) {
    await this.roleService.updateRole(
      id,
      roleDto.roleName
    );
    return {
      statusCode : HttpStatus.OK,
      message : messages.ROLE_UPDATED_SUCCESS,
      data : {}
    };

  };

  @Post("getRole")
  async getRole() {

  };

  @Post("deleteRole/:id")
  async deleteRole(
    @Param("id") id: string
  ) {
    await this.roleService.deleteRole(
      id
    );
    return {
      statusCode : HttpStatus.OK,
      message : messages.ROLE_DELETED_SUCCESS,
      data : {}
    };
  };
}
