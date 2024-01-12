import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor(private http: HttpClient, private router: Router) {}

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-={}|[\]:";'<>,.?/~`]).{8,}$/
  nameRegex =
    /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+\s[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+(\s[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){0,8}$/
  cpfRegex = /^\d{11}$/
  phoneNumberRegex = /^(\d{2})?(\d{4,5})\d{4}$/

  urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/

  dateRegex = /^\d{4}-\d{2}-\d{2}$/

  colorInput(valid: boolean, input: HTMLInputElement) {
    // Verifica se o email é válido
    if (valid) {
      input.style.borderBottomColor = 'green'
    } else {
      input.style.borderBottomColor = 'red'
    }
  }
  validateEmailData(email: string) {
    // Verifica se o email é válido
    if (this.emailRegex.test(email)) {
      return true
    } else {
      return false
    }
  }

  validatePasswordData(password: string) {
    // Verifica se a senha é válido
    if (this.passwordRegex.test(password)) {
      return true
    } else {
      return false
    }
  }

  validateNameData(name: string) {
    // Verifica se a senha é válido
    if (this.nameRegex.test(name)) {
      return true
    } else {
      return false
    }
  }

  validateCpfData(cpf: string) {
    cpf = cpf.replace(/[^\d]/g, '') // Remove caracteres não numéricos

    // Verifica se a senha é válido
    if (!this.cpfRegex.test(cpf)) {
      console.log(cpf)
      return false
    }
    if (/^(\d)\1+$/.test(cpf)) {
      console.log(2)
      return false
    }

    // Calcula o primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) {
      digit1 = 0
    }

    // Calcula o segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) {
      digit2 = 0
    }

    // Verifica se os dígitos verificadores calculados são iguais aos dígitos do CPF
    if (
      digit1 !== parseInt(cpf.charAt(9)) ||
      digit2 !== parseInt(cpf.charAt(10))
    ) {
      console.log(4)
      return false
    }

    return true
  }

  validatePhoneNumber(phoneNumber: string) {
    // Verifica se o número de telefone é válido
    phoneNumber = phoneNumber.replace(/\D/g, '')
    if (this.phoneNumberRegex.test(phoneNumber)) {
      return true
    } else {
      return false
    }
  }

  validateUrl(url: string) {
    return this.urlRegex.test(url)
  }

  validateDate(date: string) {
    return this.dateRegex.test(date)
  }
}
