import React, { useState } from "react";
import { useRegisteredContract } from "@soroban-react/contracts";
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import { useSorobanReact } from "@soroban-react/core";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import SignaturePad from "react-signature-pad-wrapper";

const FulfillOrder = () => {
  const contract = useRegisteredContract("localfoodstore");
  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;
  const [orderList, setOrderList] = useState([]);

  const handleGetUnFulfilledOrder = async () => {
    try {
      if (!address) {
        toast.error("Connect Wallet to continue");
        return;
      }
      let userLoginCheck = localStorage.getItem("userLoginName");
      if (userLoginCheck === "User not found" || userLoginCheck == null) {
        toast.error("Login User to continue");
        return;
      }
      if (!contract) {
        console.error("Contract is not initialized");
        toast.error("Unable to connect to the contract. Please try again.");
        return;
      }

      if (address) {
        const result = await contract.invoke({
          method: "get_all_unfulfilled_orders",
          args: [],
        });
        console.log("View Unfulfilled Orders result:", result);
        if (result) {
          const result_viewAllUserOrders = scValToNative(result);

          console.log(result_viewAllUserOrders);
          if (
            result_viewAllUserOrders !== null &&
            result_viewAllUserOrders !== undefined
          ) {
            setOrderList(result_viewAllUserOrders);
            toast.success("All Unfulfilled User Orders fetched Successfully");
          }
        }
      }
    } catch (error) {
      toast.error("Error during fetching All Unfulfilled User Orders");
      console.log(
        "Error while Fetching All Unfulfilled User Orders. Try again",
        error
      );
    }
  };

  function convertId(num) {
    const numberValue = Number(num);
    return numberValue;
  }

  function convertAmount(num) {
    const numberValue = Number(num);
    return numberValue / 10_000_000;
  }

  function convertDateAndTime(timestamp) {
    const milliseconds = Number(timestamp) * 1000;
    const date = new Date(milliseconds);
    return date.toLocaleString();
  }

  const handlePlaceOrderFinal = async (order) => {
    try {
      if (!address) {
        toast.error("Connect Wallet to continue");
        return;
      }
      let userLoginCheck = localStorage.getItem("userLoginName");
      if (userLoginCheck === "User not found" || userLoginCheck == null) {
        toast.error("Login User to continue");
        return;
      }
      if (!contract) {
        console.error("Contract is not initialized");
        toast.error("Unable to connect to the contract. Please try again.");
        return;
      }

      // Loop through the orderList to process each order
    //   for (const order of orderList) {
    //     // Extract values from each order
    //     const user = order.user;
    //     const amount = order.amount; // Convert amount if needed
    //     const order_id = convertId(order.id); // Convert ID if needed

        // Invoke the contract method for each order
        const result = await contract.invoke({
          method: "place_order_final",
          args: [
            nativeToScVal(address, { type: "address" }),
            nativeToScVal(order.user, { type: "address" }),
            nativeToScVal(order.amount, { type: "i128" }),
            nativeToScVal(convertId(order.id), { type: "u64" }),
          ],
          signAndSend: true,
        });

        console.log("Place Order Final result:", result);
        toast.success("Food Items delivered and Payment Successful");
        // }
    } catch (error) {
      toast.error("Error during placing final order");
      console.log("Error while placing final order. Try again", error);
    }
  };

  return (
    <>
      <Button
        variant="success"
        className="hover:bg-green-200"
        onClick={handleGetUnFulfilledOrder}
      >
        Fetch all UnFulfilled User Order
      </Button>
      <div className="p-4 space-y-4">
        {orderList.length === 0 ? (
          <p className="flex justify-center items-center text-center text-2xl text-black">
            No Orders yet
          </p>
        ) : (
          orderList.map((order, index) => (
            <div
              key={convertId(order.id) || index}
              className="p-4 border rounded-lg shadow-md bg-white mb-4"
            >
              <p className="text-lg">
                <strong className="font-bold">Amount: </strong>
                {convertAmount(order.amount)} <strong>XLM</strong>
              </p>
              <p className="text-lg">
                <strong className="font-bold">Fulfilled: </strong>
                {order.fulfilled ? "Yes" : "No"}
              </p>
              <p className="text-lg">
                <strong className="font-bold">ID: </strong>
                {convertId(order.id)}
              </p>
              <p className="text-lg">
                <strong className="font-bold">Timestamp: </strong>
                {convertDateAndTime(order.timestamp)}
              </p>
              <p className="text-lg">
                <strong className="font-bold">Deliver to Address: </strong>
                {order.home_address}
              </p>
              <p className="text-lg">
                <strong className="font-bold">User: </strong>
                {order.user}
              </p>
              <p className="text-lg">
                <strong className="font-bold">User Name: </strong>
                {order.user_name}
              </p>
              <br />
              <h3 className="text-xl font-semibold">
                <strong>Order Items</strong>
              </h3>
              <div className="space-y-2">
                {order.items.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No items in this order
                  </p>
                ) : (
                  order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-t pt-2">
                      <p className="text-lg">
                        <strong className="font-bold">Name: </strong>
                        {item[0]} {/* Assuming item has item_name */}
                      </p>
                      <p className="text-lg">
                        <strong className="font-bold">Price: </strong>
                        {convertAmount(item[2])} <strong>XLM</strong>
                      </p>
                      <p className="text-lg">
                        <strong className="font-bold">Quantity: </strong>
                        {item[1]}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <br />
              <label><strong>Customer Signature: </strong></label>
              <div className="border border-black w-[400px]">
                <SignaturePad height={150} />
              </div>
              <br />
              <Button
                className="ml-auto"
                variant="primary"
                onClick={() => handlePlaceOrderFinal(order)}
              >
                Confirm Receipt of FoodItems
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FulfillOrder;
