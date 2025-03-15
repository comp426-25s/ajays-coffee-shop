import { SupabaseClient } from "@supabase/supabase-js";
import { Order } from "../models/order";

export const broadcastOrderReady = (
  supabase: SupabaseClient,
  order: Order
) => {};
