/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from "../database";
import { EnumStatusOrder, Order } from "../entities/order.entity";
import { OrderItem } from "../entities/orderItem.entity";
import { EnumPaymentMethod, Payment } from "../entities/payment.entity";
import { ProductOption } from "../entities/productOption.entity";
import { Timeline } from "../entities/timeline.entity";
import { User } from "../entities/user.entity";
import { BadRequestError } from "../utils/error";
import { decreaseStock } from "./inventory.service";

interface data_order {
  product_option_id: number;
  quantity: number;
}

interface item_order {
  item: ProductOption;
  quantity: number;
  amount: number;
}

enum EnumTimelineStatus {
  ORDER_INIT = "Thank you for placing your order with us! We have received your order and are preparing to fulfill it.",
  ORDER_PROCESSING = "Your order is currently being processed. Our team is working diligently to ensure everything is just right.",
  ORDER_PACKAGED = "Great news! Your order has been packaged and is ready for shipping.",
  ORDER_SHIPPED = "Your order has been shipped and is on its way to you. We will send you tracking information as soon as it is available.",
  ORDER_DELIVERED = "Your order has been delivered! We hope you love your purchase and look forward to serving you again in the future.",
}

export const createOrder = async (
  user_id: number,
  products: data_order[],
  address: string | null
) => {
  const userRepo = AppDataSource.getRepository(User);
  const orderRepo = AppDataSource.getRepository(Order);
  const productOptRepo = AppDataSource.getRepository(ProductOption);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  const paymentRepo = AppDataSource.getRepository(Payment);
  const timelineRepo = AppDataSource.getRepository(Timeline);
  if (!user_id || !products) return BadRequestError("missing information");
  const user = await userRepo.findOne({
    where: {
      id: user_id,
    },
    relations: {
      address: true,
    },
  });
  if (!user) return BadRequestError("user not found");

  enum OrderError {
    quantity_exceed,
    item_not_found,
    quantity_not_valid,
  }

  interface error_info {
    type: string;
    product_option_id: number;
  }

  const err = {
    error: false,
    info: [] as error_info[],
  };

  const setError = (type: OrderError, product_option_id: number) => {
    err.error = true;
    err.info.push({
      type: OrderError[type],
      product_option_id,
    });
  };

  const items: item_order[] = [];
  await Promise.all(
    products.map(async (e) => {
      const rs = await productOptRepo.findOne({
        where: { id: e.product_option_id },
        relations: {
          price: true,
          warehouse: true,
        },
      });
      if (!rs) {
        setError(OrderError.item_not_found, e.product_option_id);
        return;
      }
      if (rs.warehouse.quantity < e.quantity) {
        setError(OrderError.quantity_exceed, e.product_option_id);
        return;
      }
      if (e.quantity <= 0) {
        setError(OrderError.quantity_not_valid, e.product_option_id);
        return;
      }

      return items.push({
        item: rs,
        quantity: e.quantity,
        amount: Number(rs.price.price) * e.quantity,
      });
    })
  );
  if (!address && !user.default_address)
    return BadRequestError("please fill address");
  if (err.error)
    return {
      errors: err.info,
    };

  const new_order = await orderRepo.save(
    orderRepo.create({
      address: address
        ? address
        : user.address.find((e) => e.id === user.default_address)?.address,
      user: user,
      payment: await paymentRepo.save(
        paymentRepo.create({
          amount: String(
            items.reduce((acc, current) => acc + current.amount, 0)
          ),
        })
      ),
    })
  );
  items.map(async (e) => {
    await orderItemRepo.save(
      orderItemRepo.create({
        order: new_order,
        product_option: e.item,
        quantity: e.quantity,
      })
    );
    await decreaseStock(e.item.id, e.quantity);
  });
  await timelineRepo.save(
    timelineRepo.create({
      order: new_order,
      content: EnumTimelineStatus.ORDER_INIT,
    })
  );

  return new_order;
};

export const getOneOrder = async (order_id: number) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const rs = await orderRepo.findOne({
    where: { id: order_id },
    relations: {
      user: true,
      orderItems: {
        product_option: {
          product: true,
        },
      },
      coupon: true,
      timeline: true,
      payment: true,
    },
  });
  if (!rs) return BadRequestError("order not found");
  const { id: _, method: method, ...payment } = rs.payment;
  return {
    order_id: rs.id,
    status: EnumStatusOrder[rs.status],
    create_at: rs.createAt,
    update_at: rs.updateAt,
    address: rs.address,
    user: rs.user,
    order_items: rs.orderItems.map((e) => {
      return {
        product_name: e.product_option.product.name,
        product_option_id: e.product_option.id,
        ram: e.product_option.ram,
        rom: e.product_option.rom,
        color: e.product_option.color,
        price: e.product_option.price,
        quantity: e.quantity,
      };
    }),
    payment: {
      method: EnumPaymentMethod[method],
      ...payment,
      x: rs.payment,
    },
    timeline: rs.timeline,
  };
};

export const getAllOrder = async (limit: number, page: number) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const offset = (page - 1) * limit;
  const [rs, count] = await orderRepo.findAndCount({
    relations: {
      user: true,
      orderItems: {
        product_option: {
          product: true,
        },
      },
      coupon: true,
      timeline: true,
      payment: true,
    },
    take: limit,
    skip: offset,
  });

  const last_page = Math.ceil(count / limit);
  const prev_page = page - 1 < 1 ? null : page - 1;
  const next_page = page + 1 > last_page ? null : page + 1;
  return count
    ? {
        current_page: page,
        prev_page,
        next_page,
        last_page,
        data_per_page: limit,
        total: count,
        data: rs.map((e) => {
          const { id: _, method: method, ...payment } = e.payment;
          return {
            order_id: e.id,
            status: EnumStatusOrder[e.status],
            create_at: e.createAt,
            update_at: e.updateAt,
            address: e.address,
            user: e.user,
            order_items: e.orderItems.map((el) => {
              return {
                product_name: el.product_option.product.name,
                product_option_id: el.product_option.id,
                ram: el.product_option.ram,
                rom: el.product_option.rom,
                color: el.product_option.color,
                price: el.product_option.price,
                quantity: el.quantity,
              };
            }),
            payment: {
              method: EnumPaymentMethod[method],
              ...payment,
            },
            timeline: e.timeline,
          };
        }),
      }
    : BadRequestError("order empty");
};

export const deleteOrder = async (order_id: number) => {
  const OrderRepo = AppDataSource.getRepository(Order);
  return (await OrderRepo.delete({ id: order_id })).affected
    ? { msg: "success" }
    : { msg: "failed" };
};

// PENDING  has been placed but hasn't yet been confirm or process - da ghi nhan don dat hang nhung chua duoc xu ly
// PROCESSING  in the process of being fulfilled and the necessary steps are being taken to get it shipped - dang xu ly
// SHIPPED  on the way to the customer - dang giao hang
// COMPLETE  the order has been successfully completed, customer received their product - don hang giao thanh cong, khach hang nhan duoc san pham
// CANCELLED  cancelled by customer or seller - don hang bi huy
// RETURNED  customer has returned or exchange - khach hang huy don hoac doi hang

export const updateStatusOrder = async (
  order_id: number,
  status: EnumStatusOrder
) => {
  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({
    where: { id: order_id },
    relations: {
      user: true,
      orderItems: {
        product_option: {
          product: true,
        },
      },
      coupon: true,
      timeline: true,
      payment: true,
    },
  });

  if (!order) return BadRequestError("order not found");
  if (order.payment.method === EnumPaymentMethod.NOT_SET) {
    return BadRequestError("please select method payment for order");
  } else {
    if (!status) return BadRequestError("status field cannot be empty");
    if (!(status in EnumStatusOrder)) return BadRequestError("status not valid");
    switch(String(EnumStatusOrder[status])){
      case String(EnumStatusOrder.PENDING): {
        return BadRequestError("Error");
      }
      case String(EnumStatusOrder.PROCESSING): {
        return await orderRepo.update({ id: order.id }, { status: Number(EnumStatusOrder[status]) });
      }
      case String(EnumStatusOrder.SHIPPED): {
        return await orderRepo.update({ id: order.id }, { status: Number(EnumStatusOrder[status]) });
      }
      case String(EnumStatusOrder.COMPLETE): {
        return await orderRepo.update({ id: order.id }, { status: Number(EnumStatusOrder[status]) });
      }
      case String(EnumStatusOrder.CANCELLED): {
        return await orderRepo.update({ id: order.id }, { status: Number(EnumStatusOrder[status]) });
      }
      case String(EnumStatusOrder.RETURNED): {
        return await orderRepo.update({ id: order.id }, { status: Number(EnumStatusOrder[status]) });
      }
    }
    return;
  }
};
