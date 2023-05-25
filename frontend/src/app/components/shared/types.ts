export interface IUF {
  id: Number;
  nome: string;
  sigla: string;
  regiao: object;
}

export interface ICity {
  id: number;
  nome: string;
  microrregiao: object;
  regiaoImediata: object;
}

export interface Dialog {
  title: string;
  text: Array<string>;
}
