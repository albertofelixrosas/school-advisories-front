import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido")
    .refine((email) => email.endsWith("@itson.edu.mx") || email.endsWith("@gmail.com"), {
      message: "Debe usar un correo institucional (@itson.edu.mx) o Gmail",
    }),
  password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre es demasiado largo"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Correo electrónico inválido")
      .refine((email) => email.endsWith("@itson.edu.mx") || email.endsWith("@gmail.com"), {
        message: "Debe usar un correo institucional (@itson.edu.mx) o Gmail",
      }),
    role: z.enum(["student", "teacher", "admin"], {
      message: "Debe seleccionar un tipo de usuario",
    }),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña es demasiado larga"),
    confirmPassword: z.string().min(1, "Debe confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
