import { EventEmitter } from '@angular/core'

export interface IUF {
  id: number
  nome: string
  sigla: string
  regiao: object
}

export interface ICity {
  id: number
  nome: string
  microrregiao: object
  regiaoImediata: object
}

export interface Dialog {
  title: string
  text: Array<string>
  confirmation: EventEmitter<number>
}

export interface RegistryField {
  title: string
  column: string
}
