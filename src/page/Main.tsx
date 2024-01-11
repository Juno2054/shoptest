import React, { useState } from "react";
import { useEffect, useRef } from "react";
import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import "../App.css";
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "HyZccn4pYtFcWyfFC1q1-";
const Main = () => {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const [price, setPrice] = useState(50_000);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        price
      );

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, []);
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON
    );
  }, [price]);

  const adad = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(), //주문번호
        orderName: "토스 티셔츠 외 2건", //주문명
        customerName: "김토스", //주문자명
        customerEmail: "customer123@gmail.com", //주문자 이메일
        successUrl: `${window.location.origin}/success`, //성공시 이동할 url
        failUrl: `${window.location.origin}/fail`, //실패시 이동할 url
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      <h1>주문서</h1>
      <p>결제 금액: {price}원</p>
      <div>
        <input
          type="checkbox"
          onChange={(event) => {
            setPrice(event.target.checked ? price - 5_000 : price + 5_000);
          }}
        />
        <label>5,000원 할인 쿠폰 적용</label>
      </div>
      <div id="payment-widget" />

      <button onClick={adad}>결제하기</button>
    </div>
  );
};

export default Main;
