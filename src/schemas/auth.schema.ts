import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario es demasiado largo")
    .regex(/^[a-zA-Z0-9._-]+$/, "El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre es demasiado largo"),
    username: z
      .string()
      .min(1, "El nombre de usuario es requerido")
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(50, "El nombre de usuario es demasiado largo")
      .regex(/^[a-zA-Z0-9._-]+$/, "El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Correo electrónico inválido")
      .refine((email) => email.endsWith("@itson.edu.mx") || email.endsWith("@gmail.com"), {
        message: "Debe usar un correo institucional (@itson.edu.mx) o Gmail",
      }),
    role: z.enum(["student", "professor", "admin"], {
      message: "Debe seleccionar un tipo de usuario",
    }),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .max(50, "La contraseña es demasiado larga"),
    confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
