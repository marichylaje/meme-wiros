import { User } from "../interfaces";

export const sampleUserData: User[] = [
  {
    id: 1,
    nombreColegio: "Colegio San Martín",
    nombreCurso: "6to Grado A",
    email: "alice@sanmartin.edu",
    contraseña: "hashed_password_1",
    templateId: "template10",
    color: {
      color1: "#FDE68A",
      color2: "#FBCFE8",
      color3: "#C4B5FD",
    },
  },
  {
    id: 2,
    nombreColegio: "Instituto Belgrano",
    nombreCurso: "3ro Año B",
    email: "bob@belgrano.edu",
    contraseña: "hashed_password_2",
    templateId: "template5",
    color: {
      color1: "#A5F3FC",
      color2: "#FCA5A5",
      color3: "#D9F99D",
    },
  },
  {
    id: 3,
    nombreColegio: "Escuela Nº4",
    nombreCurso: "1ro Secundaria",
    email: "caroline@escuela4.edu",
    contraseña: "hashed_password_3",
    templateId: "template2",
    color: {
      color1: "#BBF7D0",
      color2: "#FCD34D",
      color3: "#E0E7FF",
    },
  },
];
