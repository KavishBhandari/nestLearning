import { IsString } from "class-validator";

export class RoleDto{
    @IsString()
    roleName: string
};