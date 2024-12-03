import { supabase } from "@/integrations/supabase/client";
import { calculateOrderAmounts } from "../utils/orderCalculations";

export const createOrder = async (formData: any) => {
  console.log("Creating order with data:", formData);

  const { subtotal, gstAmount, totalWithGst, details } = calculateOrderAmounts(formData.totalAmount);

  console.log("Order amounts:", { subtotal, gstAmount, totalWithGst });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      customer_address: formData.customerAddress,
      team_member_id: formData.teamMemberId,
      team_member_name: "Unknown",
      payment_method: formData.advancePayment + "% Advance",
      notes: formData.notes,
      total_amount: totalWithGst,
      status: "pending",
      payment_status: "pending",
      payment_date: formData.paymentDate,
      advance_payment_percentage: parseInt(formData.advancePayment),
      credit_period: formData.creditPeriod,
      lead_id: formData.leadId || null,
      additional_details: details
    })
    .select()
    .single();

  if (orderError) throw orderError;

  return order;
};

export const createOrderItems = async (orderId: string, selectedItems: any[]) => {
  const orderItems = selectedItems.map(item => ({
    order_id: orderId,
    inventory_item_id: item.inventory_item_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;
};

export const updateInventory = async (selectedItems: any[]) => {
  for (const item of selectedItems) {
    const { data: currentItem, error: getError } = await supabase
      .from("inventory_items")
      .select("quantity, available_quantity")
      .eq("id", item.inventory_item_id)
      .single();

    if (getError) throw getError;

    const newAvailableQuantity = currentItem.available_quantity - item.quantity;

    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ 
        available_quantity: newAvailableQuantity
      })
      .eq("id", item.inventory_item_id);

    if (updateError) throw updateError;
  }
};