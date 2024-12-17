import { z } from "astro:schema";

export const Groups = ["BENJAMINS", "HAUGEN"] as const;
export type Group = (typeof Groups)[number];

export const UserSizesSchema = z.object({
    simple: z.object({
        top: z.string().optional(),
        bottom: z.string().optional(),
        shoe: z.string().optional(),
    }),
    advanced: z.object({
        head: z.string().optional(),
        sleeve: z.string().optional(),
        chest: z.string().optional(),
        waist: z.string().optional(),
        hip: z.string().optional(),
        inseam: z.string().optional(),
    }),
});
export type UserSizes = z.infer<typeof UserSizesSchema>;
