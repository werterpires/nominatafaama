import { Component, Input, SimpleChanges } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { IPerson } from '../types/people.types';
import { IRole } from '../types/roles.types';
import { ICreate } from '../types/roles.types copy';
import { ICreateUser, IUser } from '../types/users.types';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  constructor(
    private resourcesService: ResourcesService
  ) { }


  users!: IUser[];
  newUser: ICreateUser = {
    personId:0,
    rolesId: [],
    password:""
  }

  password2!:string
  creatingUser: ICreate = {
    active: false
  }

  people!: IPerson[]
  searchedPerson!:string
  selectedPeople!: IPerson[];

  roles!: IRole[]
  selectedRoles!: IRole[]

  @Input()methodIdx!: Number

  inputPeople!: HTMLElement | null
  selectedPeopleText!:string |undefined

  ngOnChanges(changes: SimpleChanges) {
    if (changes['methodIdx'] && changes['methodIdx'].currentValue === 2) {
      this.resourcesService.findAllUsers().subscribe(users=>{
        this.users=users
      });
    }
  }

  createUserModal() {
    this.resourcesService.findAllRoles().subscribe(roles=>{
      this.roles=roles
    })
    this.creatingUser.active = true
  }

  destroyUserModal() {
    this.creatingUser.active = false
  }

  startSearchPerson() {
    console.log('search')
    this.newUser.personId = 0

    this.resourcesService.findAllPeople().subscribe(people => {

      this.people = people
      this.selectedPeople = people
    });
  }

  selectPerson(personId:number){
    this.newUser.personId = Number(personId)
    this.selectedPeople=[]
    this.people=[]
    this.inputPeople = document.getElementById(personId.toString())
    if(this.inputPeople != null){
      this.selectedPeopleText = this.inputPeople.innerText;
    }
    if(this.selectedPeopleText != undefined){
      this.searchedPerson = this.selectedPeopleText
    }
  }

  filterPeople(){
    console.log("filter")
    this.selectedPeople = this.people.filter(person => {
      return Object.values(person).some(value => {
        return typeof value === 'string' && value.toLowerCase().normalize('NFD').includes(this.searchedPerson.toLowerCase().normalize('NFD'));
      });
    });
  }

  onChangeRoles(event: any) {
    const roleId = +event.target.value; // o sinal de + converte a string em número
    const index = this.newUser.rolesId.indexOf(roleId);
  
    if (index === -1) {
      this.newUser.rolesId.push(roleId);
    } else {
      this.newUser.rolesId.splice(index, 1);
    }
  }

  createUser() {

    this.resourcesService.createUser(this.newUser).subscribe(user => {

      alert(`O usuário ${user} foi cadastrado`)
      this.creatingUser.active = false
    })

  }
}
