import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { isConnected } from "@stellar/freighter-api";
import toast from "react-hot-toast";
import { useRegisteredContract } from "@soroban-react/contracts";
import { nativeToScVal } from "@stellar/stellar-sdk";
import { useSorobanReact } from "@soroban-react/core";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;
  const contract = useRegisteredContract("localfoodstore");

  const handleRegister = async () => {
    if (!address) {
      toast.error("Wallet not connected!");
      return;
    }

    if (!userName || !userEmail) {
      toast.error("Please fill in all details to proceed");
      return;
    }

    try {
      const checkUserHasConnected = await isConnected();

      if (!checkUserHasConnected) {
        toast.error("Please connect Wallet to continue");
        return;
      }

      try {
        if (!contract) {
          console.error("Contract is not initialized");
          toast.error("Unable to connect to the contract. Please try again.");
          return;
        }

        const result = await contract.invoke({
          method: "register",
          args: [
            nativeToScVal(address, { type: "address" }),
            nativeToScVal(userName, { type: "string" }),
            nativeToScVal(userEmail, { type: "string" }),
          ],
          signAndSend: true,
        });
        console.log("Registration result:", result.returnValue._value);
        let value = result.returnValue._value;
        if (value) {
          toast.success("User Registered Successfully");
          router.push("/");
        } else {
          toast.error("User already has an account, Login");
        }
      } catch (error) {
        toast.error("Error during Registration");
        console.log(
          "Error while sending registration transaction. Try again",
          error
        );
      }
    } catch (error) {
      console.error("Error during Connecting:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 m-4">
        <Button
          className="ms-auto bg-transparent text-black"
          onClick={handleBack}
        >
          Back
        </Button>

        <div className="px-8 py-6 mt-4 text-left bg-white h-screen m-4">
          <h1 className="text-4xl font-bold text-center">
            Register Your Account
          </h1>

          <form className="mt-4">
            <div>
              <label className="block" htmlFor="name">
                Name:{" "}
              </label>
              <br />
              <input
                type="text"
                placeholder="Name"
                id="name"
                className="w-full px-1 py-2 mt-2 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
                value={userName}
                onChange={handleNameChange}
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="email">
                Email:{" "}
              </label>
              <br />
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="w-full px-1 py-2 mt-2 border-2 border-black rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
                value={userEmail}
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button variant="success" onClick={handleRegister}>
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
