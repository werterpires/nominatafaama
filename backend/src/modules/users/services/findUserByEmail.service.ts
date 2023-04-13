import { Injectable } from '@nestjs/common';
import { UsersModel } from '../model/users.model';

@Injectable()
export class FindUserByEmail {
  constructor(private readonly usersModel: UsersModel) {}

  async findUserByEmail(email: string) {
    let user = await this.usersModel.findUserByEmail(email);
    const transformedData = user.reduce((acc, curr) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { role_id, role_name, role_description } = curr;
      const role = { role_id, role_name, role_description };

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!acc[curr.user_id]) {
        acc[curr.user_id] = {
          user_id: curr.user_id,
          password_hash: curr.password_hash,
          person_id: curr.person_id,
          created_at: curr.created_at,
          updated_at: curr.updated_at,
          first_names: curr.first_names,
          surname: curr.surname,
          email: curr.email,
          cpf: curr.cpf,
          address_id: curr.address_id,
          roles: [role],
        };
      } else {
        acc[curr.user_id].roles.push(role);
      }

      return acc;
    }, {});

    user = Object.values(transformedData);

    return user;
  }
}
