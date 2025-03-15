import { SupabaseClient } from "@supabase/supabase-js";
import { Order } from "../models/order";

export const broadcastOrderReady = (supabase: SupabaseClient, order: Order) => {
  const userChangeChannel = supabase.channel("order-ready");
  userChangeChannel
    .send({
      type: "broadcast",
      event: "orderReadyAnnouncement",
      payload: { message: order.id },
    })
    .then(() => {});
};
