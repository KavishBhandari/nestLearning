import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    //reflector: Reflector //  It is used when we need to read metadata from controller or Route

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(
            ROLES_KEY,
            context.getHandler(),
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const userRole = user.roleId?.roleName;
        console.log('User Role::::::::', userRole);

        if (!userRole) {
            throw new ForbiddenException('User role not found');
        }

        if (!requiredRoles.includes(userRole)) {
            throw new ForbiddenException(
                'You do not have permission to access this resource',
            );
        }

        return true;
    }
};