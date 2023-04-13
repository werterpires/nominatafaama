import { Injectable } from '@nestjs/common';
import { UsersModel } from '../model/users.model';

@Injectable()
export class FindAllUsersService {
  constructor(private readonly usersModel: UsersModel) {}

  async findAllUsers() {
    let allUsers = await this.usersModel.findAllUsers();
    const transformedData = allUsers.reduce((acc, curr) => {
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

    allUsers = Object.values(transformedData);

    return allUsers;
  }
}
