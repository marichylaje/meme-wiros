// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';
// src/interfaces/index.ts

export interface User {
  id: number;
  nombreColegio: string;
  nombreCurso: string;
  email: string;
  contraseña: string;
  templateId: string;
  telefono: number;
  color: {
    color1: string;
    color2: string;
    color3: string;
  };
}
