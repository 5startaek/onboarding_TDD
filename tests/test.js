/*
[결제 테스트 시나리오]

1. 주문 정보는 아래와 같은 종류를 기록할 수 있다.
    1) [결제 요청, 결제 완료, 환불 요청, 환불 완료]

2. 각 기록은 직전 기록에 의존성을 갖는다.
    1) 결제 요청: 직전 기록이 [결제 시작] 이어야  한다.
    2) 결제 완료: 직전 기록이 [결제 요청] 이어야 한다.
    4) 환불 요청: 직전 기록이 [결제 완료] 이어야 한다.
    5) 환불 완료: 직전 기록이 [환불 요청] 이어야 한다.

3. 다음과 같은 경우는 결제 요청이 불가하다.
    1) 인증 실패인 경우

4. 다음과 같은 경우 결제 실패이다.
    1) 사용자의 카드가 문제일 경우
        a. 금액이 부족한 경우
        b. 사용 불가한 카드일 경우
        c. 한도 초과일 경우
        d. 카드 정보값 오류인 경우
    2) 상품이 문제일 경우
        a. 재고가 부족한 경우
        b. 더 이상 판매하지 않는 상품일 경우
    3) 인가 실패인 경우
    4) 결제 정보 생성 및 저장을 실패한 경우
    5) 카드사 점검 시간일 경우

5. 다음과 같은 경우는 환불 요청이 불가하다.
1) 인증 실패인 경우
2) 환불 불가 상품인 경우
3) 환불 규정을 위반한 경우

6. 다음과 같은 경우 환불 실패이다.
1) 카드사 점검 시간인 경우
2) 인가 실패인 경우
3) 환불 정보 생성 및 저장을 실패한 경우
*/

import Order, {
  ORDER_STATE,
  createOrder,
  completeOrder,
  requestRefund,
  completeRefund,
} from "../app/classes/Order";
import { createProduct } from "../app/classes/Product";
import { createCard } from "../app/classes/Card";
import CardError from "../app/error/CardError";
import ProductError from "../app/error/ProductError";
import RefundError from "../app/error/RefundError";

/*
1. 주문 정보는 아래와 같은 종류를 기록할 수 있다.
    1) [결제 요청, 결제 완료, 환불 요청, 환불 완료]

2. 각 기록은 직전 기록에 의존성을 갖는다.
    1) 결제 요청: 결제가 시작되어야한다.
    2) 결제 완료: 직전 기록이 [결제 요청] 이어야 한다.
    3) 환불 요청: 직전 기록이 [결제 완료] 이어야 한다.
    4) 환불 완료: 직전 기록이 [환불 요청] 이어야 한다.
 */

describe("주문 상태 확인 테스트", () => {
  const product = createProduct("mouse", 10, 10000, true);
  const card = createCard(
    "amex",
    10000000,
    true,
    100000,
    10000000,
    "00:00",
    "00:30"
  );
  const order = createOrder("Aron", "010-1234-5678", product.name, 1);
  test("1) 결제 요청: 결제가 시작되어야 한다.", () => {
    expect(order.state).toEqual(ORDER_STATE.PAY_STARTED);
  });

  test("2) 결제 완료: 직전 기록이 [결제 요청] 이어야 한다.", () => {
    const beforeState = order.state;
    expect(beforeState).toEqual(ORDER_STATE.PAY_STARTED);
    completeOrder(order, product, card);
    expect(order.state).toEqual(ORDER_STATE.PAY_COMPLETED);
  });

  test("3) 환불 요청: 직전 기록이 [결제 완료] 이어야 한다.", () => {
    const beforeState = order.state;
    expect(beforeState).toEqual(ORDER_STATE.PAY_COMPLETED);
    requestRefund(order, product);
    expect(order.state).toEqual(ORDER_STATE.REFUND_REQUESTED);
  });

  test("4) 환불 완료: 직전 기록이 [환불 요청] 이어야 한다.", () => {
    const beforeState = order.state;
    expect(beforeState).toEqual(ORDER_STATE.REFUND_REQUESTED);
    completeRefund(order, product);
    expect(order.state).toEqual(ORDER_STATE.REFUND_COMPLETED);
  });
});

/*
4. 다음과 같은 경우 결제 실패이다.
    1) 사용자의 카드가 문제일 경우
        a. 금액이 부족한 경우
        b. 사용 불가한 카드일 경우
        c. 한도 초과일 경우
        d. 카드 정보값 오류인 경우
    2) 상품이 문제일 경우
        a. 재고가 부족한 경우
        b. 더 이상 판매하지 않는 상품일 경우
    3) 인가 실패인 경우
    4) 결제 정보 생성 및 저장을 실패한 경우
    5) 카드사 점검 시간일 경우
*/

describe("결제 실패 테스트", () => {
  test("1) a. 금액이 부족한 경우", () => {
    const product = createProduct("mouse", 10, 1000000, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      100000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    expect(() => completeOrder(order, product, card)).toThrow(CardError);
  });

  test("1) b. 사용 불가한 카드인 경우", () => {
    const product = createProduct("mouse", 10, 10000, true);
    const card = createCard(
      "amex",
      10000000,
      false,
      100000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    expect(() => completeOrder(order, product, card)).toThrow(CardError);
  });

  test("1) c. 한도 초과일 경우", () => {
    const product = createProduct("mouse", 10, 1000001, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      100000,
      1000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    expect(() => completeOrder(order, product, card)).toThrow(CardError);
  });

  test("1) d. 카드 정보값 오류인 경우", () => {
    const product = createProduct("mouse", 10, 1000001, true);
    const card = createCard(
      "KB",
      10000000,
      true,
      100000,
      1000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    expect(() => completeOrder(order, product, card)).toThrow(CardError);
  });

  test("2) a. 재고가 부족한 경우", () => {
    const product = createProduct("mouse", 1, 100000, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      1000000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 2);
    expect(() => completeOrder(order, product, card)).toThrow(ProductError);
  });

  test("2) b. 더 이상 판매하지 않는 상품일 경우", () => {
    const product = createProduct("mice", 10, 100000, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      1000000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 2);
    expect(() => completeOrder(order, product, card)).toThrow(ProductError);
  });

  test("5) 카드사 점검 시간일 경우", () => {
    const product = createProduct("mouse", 10, 100000, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      1000000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    if (
      card.checkStart <
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      }) <
      card.checkEnd
    ) {
      expect(() => completeOrder(order, product, card)).toThrow(CardError);
    } else {
      completeOrder(order, product, card);
      expect(order.state).toEqual(ORDER_STATE.PAY_COMPLETED);
    }
  });
});

/*
5. 다음과 같은 경우는 환불 요청이 불가하다.
    1) 인증 실패인 경우
    2) 환불 불가 상품인 경우
    3) 환불 규정을 위반한 경우
*/

describe("환불 요청 실패 테스트", () => {
  test("2) 환불 불가 상품인 경우", () => {
    const product = createProduct("mouse", 10, 100000, false);
    const card = createCard(
      "amex",
      10000000,
      true,
      1000000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    completeOrder(order, product, card);
    expect(() => requestRefund(order, product)).toThrow(RefundError);
  });

  test("3) 환불 규정을 위반한 경우", () => {
    const product = createProduct("mouse", 10, 100000, true);
    const card = createCard(
      "amex",
      10000000,
      true,
      1000000,
      10000000,
      "00:00",
      "00:30"
    );
    const order = createOrder("Aron", "010-1234-5678", product.name, 1);
    const purchasedDate = Date.now() - 1000 * 3600 * 24 * 8;
    completeOrder(order, product, card);
    expect(() => requestRefund(order, product, purchasedDate)).toThrow(
      RefundError
    );
  });
});
