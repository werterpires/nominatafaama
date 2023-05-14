import { Component } from '@angular/core';
import { IOptions, IPermissions, IRole, IUserApproved } from './types'
import { ContainerService } from './container.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  constructor(private containerService: ContainerService){}
  permissions:IPermissions = {
  estudante: false,
  secretaria: false,
  direcao: false,
  representacao: false,
  administrador: false,
  isApproved: false,
  }
  user!: IUserApproved
  

  options:IOptions = {
    nominata: true,
    cadastros: false,
    aprovacoes: false,
    vagas: false,
    chamados: false
  }

  choseOption(chosenOption:string): void {
    Object.keys(this.options).forEach((option: string) => {
      this.options[option as keyof IOptions] = false;
    });
    this.options[chosenOption as keyof IOptions] = true

  }


  ngOnInit(): void {
   this.containerService.findCurrentUser().subscribe({
    next: res => {
      this.user = res
      const roles = this.user.roles.map(role => role.role_name.toLowerCase());
      this.permissions.estudante = roles.includes('estudante');
      this.permissions.secretaria = roles.includes('secretaria');
      this.permissions.direcao = roles.includes('direção');
      this.permissions.representacao = roles.includes('representacao');
      this.permissions.administrador = roles.includes('administrador');
      this.permissions.isApproved = this.user.user_approved
      console.log(this.user)
      console.log(this.permissions)
    
    },
    error: err =>{
      
    }
   })

   
    
  }

  
 
  

}
