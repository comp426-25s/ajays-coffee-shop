import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createComponentClient } from "@/utils/supabase/clients/component";
import { milkText } from "@/utils/supabase/models/coffee";
import { NewOrder, NewOrderModel, Order } from "@/utils/supabase/models/order";
import { getCoffee } from "@/utils/supabase/queries/coffee";
import { fulfillOrder, getOrders } from "@/utils/supabase/queries/order";
import { broadcastOrderReady } from "@/utils/supabase/realtime/broadcast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Megaphone } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function CashierView() {
  const supabase = createComponentClient();
  const reactQueryUtils = useQueryClient();

  const { data: coffee } = useQuery({
    queryKey: ["coffee"],
    queryFn: () => getCoffee(supabase),
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(supabase),
  });

  const addOrderToCache = useCallback(
    (newOrder: NewOrder) => {
      reactQueryUtils.setQueryData(["orders"], (oldData: Order[]) => {
        // Create order object to add
        const coffeeItem = coffee?.find((c) => c.id === newOrder.coffee_id);
        if (!coffeeItem) return oldData;

        const order: Order = { ...newOrder, coffee: { name: coffeeItem.name } };
        return [...oldData, order];
      });
    },
    [coffee, reactQueryUtils]
  );

  const removeOrderFromCache = useCallback(
    (order: Order) => {
      reactQueryUtils.setQueryData(["orders"], (oldData: Order[]) => {
        return oldData.filter((o) => o.id !== order.id);
      });
    },
    [reactQueryUtils]
  );

  useEffect(() => {
    const dbChangesChannel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            addOrderToCache(NewOrderModel.parse(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      dbChangesChannel.unsubscribe();
    };
  }, [addOrderToCache, supabase]);

  const onFulfillOrder = async (order: Order) => {
    await fulfillOrder(supabase, order);
    removeOrderFromCache(order);
  };

  const onAnnounce = (order: Order) => {
    broadcastOrderReady(supabase, order);
  };

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            View all orders that have been placed here.
          </p>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-8">
        {orders &&
          orders.map((order: Order, orderIndex: number) => (
            <div key={order.id} className="flex flex-col w-full h-12 gap-3">
              {orderIndex === 0 && <Separator />}
              <div className="flex flex-row items-center w-full gap-4">
                <p className="font-semibold">Order #{order.id}</p>
                <p className="font-semibold">
                  {order.coffee.name} ({order.type})
                </p>
                <p className="text-muted-foreground">
                  {" "}
                  with{" "}
                  <span className="font-semibold">{milkText(order.milk)}</span>
                </p>
                <div className="flex flex-row gap-4 items-center ml-auto">
                  <p className="text-muted-foreground font-semibold mr-3">
                    {order.name}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => onFulfillOrder(order)}
                  >
                    <Check />
                    Fulfill Order
                  </Button>
                  <Button onClick={() => onAnnounce(order)}>
                    <Megaphone />
                    Announce
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
      </div>
    </div>
  );
}
