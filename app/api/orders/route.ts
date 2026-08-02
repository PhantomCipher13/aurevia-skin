import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/* ── POST /api/orders — Create a new order ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,          // [{ productId, productName, productImage, productSlug, quantity, unitPrice }]
      shippingAddress, // { full_name, street, city, state, zip, phone }
      couponCode,
      discountAmount = 0,
      shippingAmount = 0,
      paymentMethod = "cod",
      customerName,
      customerEmail,
      customerPhone,
      userId,
    } = body;

    if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

    const adminSb = createAdminClient();

    // Validate items and get current prices
    const productIds = items.map((i: any) => i.productId);
    const { data: products } = await adminSb
      .from("products")
      .select("id, name, price, sale_price, slug")
      .in("id", productIds)
      .eq("status", "active");

    if (!products?.length) return NextResponse.json({ error: "Products not found" }, { status: 400 });

    // Calculate totals using DB prices (not client-provided)
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      const unitPrice = product?.sale_price ?? product?.price ?? item.unitPrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        product_id:    item.productId,
        product_name:  product?.name ?? item.productName,
        product_image: item.productImage,
        product_slug:  product?.slug ?? item.productSlug,
        quantity:      item.quantity,
        unit_price:    unitPrice,
        total_price:   totalPrice,
      };
    });

    const total = subtotal - discountAmount + shippingAmount;

    // Generate order number
    const orderNumber = `AUR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    // Insert order
    const { data: order, error: orderErr } = await adminSb
      .from("orders")
      .insert({
        order_number:     orderNumber,
        user_id:          userId ?? null,
        customer_name:    customerName,
        customer_email:   customerEmail,
        customer_phone:   customerPhone,
        shipping_address: shippingAddress,
        subtotal,
        discount_amount:  discountAmount,
        coupon_code:      couponCode ?? null,
        shipping_amount:  shippingAmount,
        total,
        status:           "confirmed",
        payment_status:   paymentMethod === "cod" ? "pending" : "paid",
        payment_method:   paymentMethod,
      })
      .select("id, order_number")
      .single();

    if (orderErr) throw orderErr;

    // Insert order items
    await adminSb.from("order_items").insert(
      orderItems.map((item: any) => ({ order_id: order.id, ...item }))
    );

    // Insert first timeline event
    await adminSb.from("order_timeline").insert({
      order_id: order.id,
      status: "confirmed",
      note: "Order placed successfully",
    });

    // Decrement inventory
    for (const item of orderItems) {
      await adminSb.rpc("decrement_inventory", {
        p_product_id: item.product_id,
        p_quantity:   item.quantity,
      }).then(r => {
        if (r.error) {
          // Fallback: manual decrement
          adminSb.from("inventory")
            .select("quantity")
            .eq("product_id", item.product_id)
            .single()
            .then(({ data }) => {
              if (data) {
                adminSb.from("inventory")
                  .update({ quantity: Math.max(0, data.quantity - item.quantity) })
                  .eq("product_id", item.product_id);
              }
            });
        }
      });
    }

    // Increment coupon used_count
    if (couponCode) {
      await adminSb.from("coupons")
        .update({ used_count: adminSb.rpc("increment", { count: 1 }) as any })
        .eq("code", couponCode);
    }

    // Update product sold_count
    for (const item of orderItems) {
      await adminSb
        .from("products")
        .select("sold_count")
        .eq("id", item.product_id)
        .single()
        .then(({ data }) => {
          if (data) {
            adminSb.from("products")
              .update({ sold_count: (data.sold_count ?? 0) + item.quantity })
              .eq("id", item.product_id);
          }
        });
    }

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.order_number });
  } catch (err: any) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: err.message ?? "Order failed" }, { status: 500 });
  }
}

/* ── GET /api/orders — List orders (admin only) ── */
export async function GET(request: NextRequest) {
  try {
    const serverSb = await createClient();
    const { data: { user } } = await serverSb.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminSb = createAdminClient();
    const { data: profile } = await adminSb.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(request.url);
    const page    = parseInt(url.searchParams.get("page")  ?? "1");
    const limit   = parseInt(url.searchParams.get("limit") ?? "50");
    const status  = url.searchParams.get("status");

    let q = adminSb.from("orders")
      .select(`*, order_items(*)`, { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status && status !== "all") q = q.eq("status", status);

    const { data, count, error } = await q;
    if (error) throw error;

    return NextResponse.json({ orders: data, total: count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
