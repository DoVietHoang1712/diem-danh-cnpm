import { Ability, defineAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../../../common/types";
import { DB_PROFILE } from "../../repository/db-collection";
import { SystemRole } from "../../user/common/user.constant";
import { UserDocument } from "../../user/entities/user.entity";

@Injectable()
export class ProfileAbitityFactory {
    createForUser(user: UserDocument) {
        return defineAbility<Ability<[Action, any]>>((can, cannot) => {
            if (user.systemRoles.includes(SystemRole.ADMIN)) {
                can("manage", DB_PROFILE);
            } else if (user.systemRoles.includes(SystemRole.USER)) {
                can("read", DB_PROFILE, { username: user.username });
                can("update", DB_PROFILE, { username: user.username });
            }
        });
    }
}

const x = new ProfileAbitityFactory().createForUser({systemRoles: [SystemRole.USER]} as UserDocument);