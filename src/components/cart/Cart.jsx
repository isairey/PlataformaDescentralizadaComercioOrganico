require("dotenv").config();
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Stack, Table } from "react-bootstrap";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSorobanReact } from "@soroban-react/core";
import { useRegisteredContract } from "@soroban-react/contracts";
import { nativeToScVal } from "@stellar/stellar-sdk";

const Cart = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const contract = useRegisteredContract("localfoodstore");
  const [txHash, setTxHash] = useState("");
  const [showTxHash, setShowTxHash] = useState(false);
  const [specificCartItem, setSpecificCartItem] = useState([]);
  const [homeAddress, setHomeAddress] = useState("");
  const [amount, setAmount] = useState();
  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;
  const [showTextAreaBox, setShowTextAreaBox] = useState(true);

  const handleChange = (event) => {
    setHomeAddress(event.target.value);
  };

  useEffect(() => {
    // Load cart items from local storage on component mount
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const calculateTotal = () => {
      return cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };

    const newTotal = calculateTotal();
    setTotalAmount(newTotal * 10 ** 7);
    setAmount(newTotal);

    // Map through cartItems and create the specificCartItems array
    const mappedCartItems = cartItems.map((item) => ({
      name: item.name, // Extract the name field
      quantity: item.quantity, // Extract the quantity field
      price: item.price, // Extract the price field
    }));

    setSpecificCartItem(mappedCartItems);
  }, [cartItems]);

  // Convert CartItem to the expected format for Soroban
  const serializeCartItem = (item) => [
    nativeToScVal(item.name, { type: "string" }),
    nativeToScVal(item.quantity, { type: "u32" }),
    nativeToScVal(item.price * 10 ** 7, { type: "i128" }),
  ];

  // Convert an array of CartItems
  const serializeCartItems = (items) => items.map(serializeCartItem);

  const handleOrder = async () => {
    try {
      if (homeAddress == "") {
        toast.error("Fill in your delivery address to continue");
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

      const serializedItems = serializeCartItems(specificCartItem);

      // Flatten the serialized items array to pass it correctly
      //const flattenedItems = serializedItems.flat();
      console.log("Specific Cart Item: ", specificCartItem);
      console.log("Serialized Cart Item: ", serializedItems);

      // console.log("Flattened Cart Item: ", flattenedItems);

      if (address) {
        const result = await contract.invoke({
          method: "place_order",
          args: [
            nativeToScVal(address, { type: "address" }),
            nativeToScVal(totalAmount, { type: "i128" }),
            nativeToScVal(serializedItems, { type: "array" }), //remove if error arises
            nativeToScVal(homeAddress, { type: "string" }),
            nativeToScVal(userLoginCheck, { type: "string" }),

          ],
          signAndSend: true,
        });
        console.log("Place Order result:", result);

        setTxHash(result.txHash);
        toast.success("Order Placed Successfully");

        localStorage.removeItem("cartItems");
        setCartItems([]);
        setShowTextAreaBox(false);
      }
    } catch (error) {
      toast.error("Error during Placing Order");
      console.log("Error while Placing Order. Try again", error);
    }
  };

  const handleOrderTxHash = () => {
    setShowTxHash(!showTxHash);
  };

  return (
    <div className="p-4">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <Image
                  width={300}
                  height={200}
                  src={item.image}
                  alt={item.name}
                  className="object-cover"
                />
              </td>
              <td>{item.name}</td>
              <td>{item.price} XLM</td>
              <td className="flex items-center justify-center">
                <Button
                  variant="secondary"
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="secondary"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Stack direction="vertical">
        <strong>Total: {totalAmount / 10_000_000} XLM</strong>
        <br />
        {showTextAreaBox ? (
          <>
            <label>
              <strong>Delivery Address: </strong>
            </label>
            <textarea
              className="border-2 border-black p-4"
              value={homeAddress}
              onChange={handleChange}
              placeholder="Enter your home address or delivery address"
              rows={2}
              cols={20}
            />
          </>
        ) : (
          ""
        )}
      </Stack>
      <Stack direction="horizontal">
        <div className="mt-4 text-right">
          <Stack direction="horizontal" gap={2}>
            <Button className="ml-auto" variant="primary" onClick={handleOrder}>
              Place Order
            </Button>
            <Button
              className="ml-auto"
              variant="primary"
              onClick={handleOrderTxHash}
            >
              {showTxHash ? "Hide Transaction Hash" : "Show Transaction Hash"}
            </Button>
            <div>
              {showTxHash && (
                <p>
                  Order Transaction Hash:{" "}
                  <a
                    href={`https://stellar.expert/explorer/testnet/search?term=${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong className="font-bold">View Transaction</strong>
                  </a>
                </p>
              )}
            </div>
          </Stack>
        </div>
      </Stack>
      <div className="mt-4 text-center">
        <Link href="/foodItems" passHref>
          <Button variant="success">Back to Food Store</Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
