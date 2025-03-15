import { z } from "zod";

export const CoffeeModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  label: z.string().nullable(),
  image_url: z.string(),
});

export type Coffee = z.infer<typeof CoffeeModel>;

export const milkText = (milk: string) => {
  switch (milk) {
    case "whole":
      return "Whole Milk";
    case "reduced":
      return "2% Milk";
    case "almond":
      return "Almond Milk";
    case "oat":
      return "Oat Milk";
  }
};
