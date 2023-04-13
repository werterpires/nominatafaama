import { Component, Input } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { IAddress, ICreateAddress } from '../types/adresses.types';
import { ICreate } from '../types/roles.types copy';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})

export class AddressesComponent {

  constructor(
    private resourcesService: ResourcesService
  ) { }

  @Input() addresses!: IAddress[];
  creatingAddress: ICreate = {
    active: false
  }
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

  createAddressModal() {
    this.creatingAddress.active = true
  }

  destroyAddressModal() {
    this.creatingAddress.active = false
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

  createAddress() {
    this.resourcesService.createAddress(this.newAddress).subscribe(address => {
      alert(`O endereço ${address} foi cadastrado`)
      this.creatingAddress.active = false
    })

  }

}
