import StateError from "../error/StateError.js";
import CardError from "../error/CardError.js";
import ProductError from "../error/ProductError.js";
import RefundError from "../error/RefundError.js";

export const ORDER_STATE = {
  PAY_STARTED: "payStarted",
  PAY_COMPLETED: "payCompleted",
  REFUND_REQUESTED: "refundRequested",
  REFUND_COMPLETED: "refundCompleted",
};

export default class Order {
  constructor(
    userName,
    userPhone,
    productName,
    orderNum,
    purchasedDate,
    state
  ) {
    this._userName = userName;
    this._userPhone = userPhone;
    this._productName = productName;
    this._orderNum = orderNum;
    this._purchasedDate = purchasedDate;
    this._state = state;
  }

  // get userName() {
  //   return this._userName;
  // }
  //
  // get userPhone() {
  //   return this._userPhone;
  // }
  //
  // get productName() {
  //   return this._productName;
  // }

  get orderNum() {
    return this._orderNum;
  }

  // get purchasedDate() {
  //   return this._purchasedDate;
  // }

  get state() {
    return this._state;
  }

  // set userName(value) {
  //   this.isPayStarted();
  //   this._userName = value;
  // }

  // set userPhone(value) {
  //   this.isPayStarted();
  //   this._userPhone = value;
  // }

  set orderNum(value) {
    this.isPayStarted();
    this._orderNum = value;
  }
  //
  // set purchasedDate(value) {
  //   this.isPayStarted();
  //   this._purchasedDate = value;
  // }

  set state(state) {
    this._state = state;
  }

  isPayStarted() {
    if (this._state === ORDER_STATE.PAY_STARTED) {
      return true;
    } else {
      throw new StateError("결제 진행");
    }
  }

  isPayCompleted() {
    if (this._state === ORDER_STATE.PAY_COMPLETED) {
      return true;
    } else {
      throw new StateError("결제 완료");
    }
  }

  isRefundRequested() {
    if (this._state === ORDER_STATE.REFUND_REQUESTED) {
      return true;
    } else {
      throw new StateError("환불 요청");
    }
  }
}

export const createOrder = (userName, userPhone, productName, orderNum) => {
  return new Order(
    userName,
    userPhone,
    productName,
    orderNum,
    Date.now(),
    ORDER_STATE.PAY_STARTED
  );
};

// export const saveOrder = async (order) => {
//     return await insertOrder(order);
// }
//
// export const getOrder = async (userPhone) => {
//     return await findOrder(userPhone);
// }
//
// export const getAllOrder = async () => {
//     return await findAllOrder();
// }

export const completeOrder = (order, product, card) => {
  order.isPayStarted();
  if (
    card.limit >= product.price * order.orderNum &&
    card.budget < product.price * order.orderNum
  ) {
    throw new CardError("잔액이 부족합니다.");
  }
  if (!card.validity) {
    throw new CardError("사용 불가한 카드입니다.");
  }
  if (card.limit < product.price * order.orderNum) {
    throw new CardError("한도 초과입니다.");
  }
  if (card.company !== "amex" || card.cardNumber !== 10000000) {
    throw new CardError("존재하지 않는 카드 번호입니다.");
  }
  if (order.orderNum > product.number) {
    throw new ProductError("재고가 부족합니다.");
  }
  if (product.name !== "mouse") {
    throw new ProductError("존재하지 않는 상품입니다.");
  }
  if (
    card.checkStart <
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      }) &&
    card.checkEnd >
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      })
  ) {
    throw new CardError("카드사 점검 시간입니다.");
  }

  order.state = ORDER_STATE.PAY_COMPLETED;
  return true;
};

export const requestRefund = (order, product, purchasedDate) => {
  order.isPayCompleted();
  // order.purchasedDate = (Date.now() - 1000 * 3600 * 24 * 8);
  if (!product.refundable) {
    throw new RefundError("환불이 불가능한 상품입니다.");
  }
  if ((Date.now() - purchasedDate) / (1000 * 3600 * 24) > 7) {
    throw new RefundError("환불 신청이 가능한 기간이 지났습니다.");
  }
  order.state = ORDER_STATE.REFUND_REQUESTED;
  return true;
};

export const completeRefund = (order) => {
  order.isRefundRequested();
  order.state = ORDER_STATE.REFUND_COMPLETED;
  return true;
};
