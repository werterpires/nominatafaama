import { Component, Input, ViewChild } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { IAddress, ICreateAddress } from '../types/adresses.types';
import { ICreatePerson, IPerson } from '../types/people.types';
import { ICreate } from '../types/roles.types copy';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  constructor(
    private resourcesService: ResourcesService
  ) { }

  @Input() people!: IPerson[];

  creatingPerson: ICreate = {
    active: false
  }
  newPerson: ICreatePerson = {
    firstName: "",
    surname: "",
    email: "",
    cpf: "",
    addressId: null,
    address: null
  }

  @Input() addresses!: IAddress[];
  newAddress: ICreateAddress = {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    referencePoint: "",
    zipCode: "",
    mailbox: "",
  }

  inputAddress!: HTMLElement | null

  selectedAddressText!:string |undefined

  @Input() selectedAddresses!: IAddress[];
  searchedAddress!:string
  


  createPersonModal() {
    this.creatingPerson.active = true
    this.resourcesService.findAllAddresses().subscribe(addresses =>{
    this.addresses = addresses
    })
  }


  destroyPersonModal() {
    this.creatingPerson.active = false
  }
  startSearchAddress() {
    this.newPerson.addressId = null

    this.resourcesService.findAllAddresses().subscribe(addresses => {

      this.addresses = addresses
      this.selectedAddresses = addresses
    });
  }

  selectAddress(addressId:number){
    this.newPerson.addressId = Number(addressId)
    this.selectedAddresses=[]
    this.inputAddress = document.getElementById(addressId.toString())
    if(this.inputAddress != null){
      this.selectedAddressText = this.inputAddress.innerText;
    }
    if(this.selectedAddressText != undefined){
      this.searchedAddress = this.selectedAddressText
    }      

  }

  filterAddresses(){
    this.selectedAddresses = this.addresses.filter(address => {
      return Object.values(address).some(value => {
        return typeof value === 'string' && value.toLowerCase().normalize('NFD').includes(this.searchedAddress.toLowerCase().normalize('NFD'));
      });
    });
  }


  findCep(){
    this.resourcesService.findCep(this.newAddress.zipCode).subscribe(cepAddress =>{
      this.newAddress.street = cepAddress.logradouro;
      this.newAddress.city = cepAddress.localidade;
      this.newAddress.complement = cepAddress.complemento
      this.newAddress.neighborhood = cepAddress.bairro
      this.newAddress.state = cepAddress.uf
      this.newAddress.zipCode = cepAddress.cep
    })
  }

  createPerson() {
    console.log(this.newPerson)
    if (this.newPerson.addressId === null) {
      this.newPerson.address = this.newAddress
    }
    console.log(this.newPerson)
    this.resourcesService.createPerson(this.newPerson).subscribe(person => {

      alert(`A pessoa ${person} foi cadastrada`)
      this.creatingPerson.active = false
    })

  }

}
