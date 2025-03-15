import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Coffee } from "@/utils/supabase/models/coffee";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { placeOrder } from "@/utils/supabase/queries/order";
import { createComponentClient } from "@/utils/supabase/clients/component";

export default function CoffeeDialog({
  coffee,
  children,
}: {
  coffee: Coffee;
  children: React.ReactNode;
}) {
  const supabase = createComponentClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [type, setType] = useState<string>("hot");
  const [milk, setMilk] = useState<string>("whole");
  const [name, setName] = useState<string>("");

  const submitOrder = async () => {
    await placeOrder(supabase, coffee, type, milk, name);
    setIsDialogOpen(false);
    toast("Order placed successfully!");
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            Place an order for pickup at the counter.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-row w-full gap-3">
          <Image
            className="rounded-xl h-[100px] object-cover"
            src={coffee.image_url}
            width={100}
            height={100}
            alt="Pumpkin Spice Latte"
          />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{coffee.name}</p>
            <p className="text-muted-foreground text-sm">
              {coffee.description}
            </p>
          </div>
        </div>
        <Separator />
        <p className="font-semibold">Options</p>
        <div className="flex flex-row items-center justify-between gap-2">
          <p className="text-sm font-semibold">Hot or Iced?</p>
          <Select value={type} onValueChange={(newValue) => setType(newValue)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="iced">Iced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
          <p className="text-sm font-semibold">Milk</p>
          <Select value={milk} onValueChange={(newValue) => setMilk(newValue)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whole">Whole Milk</SelectItem>
              <SelectItem value="reduced">2% Milk</SelectItem>
              <SelectItem value="almond">Almond Milk</SelectItem>
              <SelectItem value="oat">Oat Milk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
          <p className="text-sm font-semibold">Order Name</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[180px]"
            placeholder="Your name"
          />
        </div>
        <Separator />
        <DialogFooter>
          <Button
            className="w-full hover:cursor-pointer"
            size="lg"
            disabled={!type || !milk || !name || name.length < 1}
            onClick={submitOrder}
          >
            Place Order ($5.50)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
