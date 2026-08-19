"use client";

import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  TbBrandApple,
  TbShieldLock,
  TbWallet,
  TbCheck,
  TbAlertTriangle,
} from "react-icons/tb";

const BASE_URL = "https://dev.pkrdcoin.com";

const Home = () => {
  const [amount, setAmount] = useState(50000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [createdTime, setCreatedTime] = useState("");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setOrderId(`ORD-${Date.now()}`);
      setCreatedTime(moment().format("DD MMM YYYY hh:mm A"));
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const product = {
    name: "iPhone 15",
    variant: "Black • 128GB",
    brand: "Apple",
    quantity: 1,
  };

  const customer = {
    name: "Babu",
    email: "babu.dev@example.com",
    phone: "9876543210",
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setResult(null);

      // STEP 1 → GET SIGNATURE
      const sigRes = await axios.post(
        `${BASE_URL}/api/v1/paymentIntent/getSignatureAndTimestamp`,
        {
          apiSecret: "10d50b84-9f8a-401c-bd81-0e6bdec6964e",
          orderId,
          amount: Number(amount),
          currency: "PKRD",
        },
        {
          headers: {
            Authorization: "Bearer YOUR_TOKEN",
          },
        }
      );

      const { signature, timestamp } = sigRes?.data?.data;

      // STEP 2 → CREATE PAYMENT INTENT
      const paymentRes = await axios.post(
        `${BASE_URL}/api/v1/paymentIntent/create-payment-intent`,
        {
          orderId,
          amount: Number(amount),
          currency: "PKRD",

          webhookId:
            "fw1qjn6URh4BIkRE069fxeGKuGRMpjzWuqYqUYRT2sMY1FXy9U",

          redirect_url: "https://yourmerchant.com/thank-you",

          purpose: "payment",

          metadata: {
            type: "product",
            referenceId: "PROD-IPHONE15-128",
            name: "iPhone 15",
            description: "iPhone 15 Black 128GB",
            quantity: 1,

            custom: {
              category: "electronics",
              brand: "Apple",
            },
          },

          // integrationContext: {
          //   source: "web",
          //   module: "checkout",
          //   integrationName: "custom_store",
          //   environment: "production",
          // },

          customer,

          items: [
            {
              itemId: "PROD-IPHONE15-128",
              name: "iPhone 15",
              price: Number(amount),
              quantity: 1,
              total: Number(amount),
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",

            "x-api-key":
              "c0517a12-72c2-4d5e-9eef-1d1cb4c2507a",

            "x-signature": signature,

            "x-timestamp": timestamp,
          },
        }
      );

      setResult(paymentRes?.data);

      const redirectUrl =
        paymentRes?.data?.data?.redirect_url;

      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (err) {
      console.log(err);

      setResult(
        err?.response?.data || {
          success: false,
          message: "Payment Failed",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-black text-white p-6">

            <div className="flex justify-between items-center">

              <div>
                <h1 className="text-2xl font-bold">
                  PKRD Checkout
                </h1>

                <p className="text-sm text-gray-300 mt-1">
                  Secure crypto payment gateway
                </p>
              </div>

              <div className="bg-white/10 px-3 py-1 rounded-full text-xs uppercase">
                LIVE
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6">

            {/* PRODUCT */}
            <div className="border rounded-2xl p-5">

              <div className="flex justify-between items-start gap-4">

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                    <TbBrandApple size={34} />
                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      {product.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {product.variant}
                    </p>

                    <p className="text-sm text-gray-500">
                      Brand: {product.brand}
                    </p>
                  </div>
                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold">
                    ₹{Number(amount).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
            </div>

            {/* ORDER DETAILS */}
            <div className="mt-5 border rounded-2xl p-5 bg-zinc-50">

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">
                  Order ID
                </span>

                <span className="font-medium">
                  {orderId}
                </span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">
                  Currency
                </span>

                <span className="font-medium">
                  PKRD
                </span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">
                  Created
                </span>

                <span className="font-medium">
                  {createdTime}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total Amount</span>

                <span>
                  ₹{Number(amount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* AMOUNT EDIT */}
            <div className="mt-5">

              <label className="text-sm text-gray-600 mb-2 block">
                Modify Amount (Demo Purpose)
              </label>

              <input
                type="number"
                value={amount}
                min={1}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* CUSTOMER */}
            <div className="mt-5 border rounded-2xl p-5">

              <h3 className="font-semibold mb-4">
                Customer Information
              </h3>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Name
                  </span>

                  <span>{customer.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Email
                  </span>

                  <span>{customer.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Phone
                  </span>

                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT BUTTON */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`
              mt-6 w-full py-4 rounded-2xl font-semibold text-white transition-all
              flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-zinc-400"
                  : "bg-black hover:opacity-90"
              }
            `}
            >
              <TbWallet size={22} />

              {loading
                ? "Processing Payment..."
                : `Pay ₹${Number(amount).toLocaleString()}`}
            </button>

            {/* RESULT */}
            {result && (
              <div
                className={`
                mt-5 rounded-2xl p-4 border
                ${
                  result?.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              `}
              >

                <div className="flex items-start gap-3">

                  <div>
                    {result?.success ? (
                      <TbCheck
                        size={24}
                        className="text-green-600"
                      />
                    ) : (
                      <TbAlertTriangle
                        size={24}
                        className="text-red-600"
                      />
                    )}
                  </div>

                  <div className="flex-1">

                    <p
                      className={`
                      font-semibold
                      ${
                        result?.success
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    `}
                    >
                      {result?.message}
                    </p>

                    {result?.data?.payment_action_key && (
                      <div className="mt-2 text-xs break-all">
                        <strong>Payment Key:</strong>{" "}
                        {
                          result?.data
                            ?.payment_action_key
                        }
                      </div>
                    )}

                    {result?.data?.payment_intent_id && (
                      <div className="mt-1 text-xs break-all">
                        <strong>Intent ID:</strong>{" "}
                        {
                          result?.data
                            ?.payment_intent_id
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">

              <TbShieldLock size={16} />

              <span>
                100% Secure Crypto Payment Powered by PKRD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;