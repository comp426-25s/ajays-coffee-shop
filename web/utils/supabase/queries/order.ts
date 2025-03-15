import { SupabaseClient } from "@supabase/supabase-js";
import { Coffee } from "../models/coffee";
import { Order, OrderModel } from "../models/order";

export const placeOrder = async (
  supabase: SupabaseClient,
  coffee: Coffee,
  type: string,
  milk: string,
  name: string
): Promise<void> => {
  const { error } = await supabase
    .from("order")
    .insert({ coffee_id: coffee.id, type, milk, name, fulfilled: false });

  if (error) {
    throw new Error(error.message);
  }
};

export const fulfillOrder = async (
  supabase: SupabaseClient,
  order: Order
): Promise<void> => {
  const { error } = await supabase
    .from("order")
    .update({ fulfilled: true })
    .eq("id", order.id);

  if (error) {
    throw new Error(error.message);
  }
};

export const getOrders = async (supabase: SupabaseClient): Promise<Order[]> => {
  const { data: orderData, error: orderError } = await supabase
    .from("order")
    .select(`id, coffee (name), type, milk, name, fulfilled`)
    .eq("fulfilled", false);

  if (orderError) {
    throw new Error(orderError.message);
  }

  return OrderModel.array().parse(orderData);
};
