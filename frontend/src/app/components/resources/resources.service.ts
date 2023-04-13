import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAddress, ICepAddress, ICreateAddress } from './types/adresses.types';
import { ICreateItemCategory, IItemCategory } from './types/itensCategory.types';
import { ICreateItemSubCategory, IItemSubCategory } from './types/itensSubCategory.types';
import { ICreatePerson, IPerson } from './types/people.types';
import { IRole } from './types/roles.types';
import { ICreateUser, IUser } from './types/users.types';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(
    private http: HttpClient,
  ) { };

  findAllAddresses(): Observable<IAddress[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IAddress[]>('http://localhost:3000/addresses', { headers: head_obj });
  }

  createAddress(newAddress: ICreateAddress): Observable<IAddress[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.post<IAddress[]>('http://localhost:3000/addresses', newAddress, { headers: head_obj });
  }

  findCep(cep:string): Observable<ICepAddress>{
    let cepUrl = `http://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<ICepAddress>(cepUrl)
  }

  checkAddress(newAddress:ICreateAddress, addresses:IAddress[]){
    const isDuplicate = addresses.some(existingAddress => {
      return existingAddress.city === newAddress.city &&
             existingAddress.mailbox === newAddress.mailbox &&
             existingAddress.neighborhood === newAddress.neighborhood &&
             existingAddress.number === newAddress.number &&
             existingAddress.state === newAddress.state &&
             existingAddress.street === newAddress.street &&
             existingAddress.zip_code === newAddress.zipCode;
    })
  }

  findAllPeople(): Observable<IPerson[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IPerson[]>('http://localhost:3000/people', { headers: head_obj });
  }

  createPerson(newPerson: ICreatePerson): Observable<IPerson[]> {
 
    if(newPerson.addressId != null) {newPerson.addressId = Number(newPerson.addressId)}
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.post<IPerson[]>('http://localhost:3000/People', newPerson, { headers: head_obj });
  }

  findAllUsers(): Observable<IUser[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IUser[]>('http://localhost:3000/users', { headers: head_obj });
  }

  createUser(newUser: ICreateUser): Observable<IUser[]> {

    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.post<IUser[]>('http://localhost:3000/users', newUser, { headers: head_obj });
  }

  findAllRoles(): Observable<IRole[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IRole[]>('http://localhost:3000/roles', { headers: head_obj });
  }

  findAllItensCategory(): Observable<IItemCategory[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IItemCategory[]>('http://localhost:3000/itensCategory', { headers: head_obj });
  }

  createItemCategory(newitemCategory: ICreateItemCategory): Observable<IItemCategory[]> {
    
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.post<IItemCategory[]>('http://localhost:3000/itensCategory', newitemCategory, { headers: head_obj });
  }

  findAllItensSubCategory(): Observable<IItemSubCategory[]> {
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.get<IItemSubCategory[]>('http://localhost:3000/itensSubCategory', { headers: head_obj });
  }

  createItemSubCategory(newItemSubCategory: ICreateItemSubCategory): Observable<IItemSubCategory[]> {
    newItemSubCategory.categoryId = Number(newItemSubCategory.categoryId)
    console.log(newItemSubCategory)
    const token = localStorage.getItem('access_token')
    let head_obj = new HttpHeaders().set("Authorization", "bearer " + token)
    return this.http.post<IItemSubCategory[]>('http://localhost:3000/itensSubCategory', newItemSubCategory, { headers: head_obj });
  }


}

