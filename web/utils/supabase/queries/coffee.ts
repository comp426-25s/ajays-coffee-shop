import { SupabaseClient } from "@supabase/supabase-js";
import { Coffee, CoffeeModel } from "../models/coffee";

export const getCoffee = async (supabase: SupabaseClient): Promise<Coffee[]> => {
  const { data: coffeeData, error: coffeeError } = await supabase.from("coffee").select(
    `id, name, description, price, label, image_url`
  );

    if (coffeeError) {
        throw new Error(coffeeError.message);
    }

    return CoffeeModel.array().parse(coffeeData);
}