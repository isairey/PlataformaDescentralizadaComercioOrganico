import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSorobanReact } from "@soroban-react/core";
import { useRegisteredContract } from "@soroban-react/contracts";
import { nativeToScVal, scValToNative, xdr } from "@stellar/stellar-sdk";
import { i128 } from "stellar-sdk/lib/contract";

const Reward = () => {
  const [rewardAmt, setRewardAmt] = useState<number>(0);
  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;
  const contract = useRegisteredContract("localfoodstore");

  const handleViewReward = async () => {
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
          method: "get_total_user_rewards",
          args: [nativeToScVal(address, { type: "address" })],
        });
        console.log("User Rewards result:", result);
        if (result) {
          const result_userReward = scValToNative(result as xdr.ScVal) as i128;

          console.log(result_userReward);
          if (result_userReward !== null && result_userReward !== undefined) {
            toast.success("User Reward fetched Successfully");
            const numberValue = Number(result_userReward);
            setRewardAmt(numberValue / 10_000_000);
          }
        }
      }
    } catch (error) {
      toast.error("Error during fetching User Reward");
      console.log("Error while Fetching user Reward. Try again", error);
    }
  };

  const handleClaimReward = async () => {
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
          method: "process_user_reward",
          args: [nativeToScVal(address, { type: "address" })],
          signAndSend: true,
        });
        console.log("User Paid Rewards result:", result);
        toast.success("User Paid Reward Successfully");
        setRewardAmt(0);
      }
    } catch (error) {
      toast.error("Error during Paying User Reward");
      console.log("Error while Paying User Reward. Try again", error);
    }
  };
  return (
    <Container>
      <h5 className="m-4">
        <b>Note: </b>You can start earning after you have bought orders over 100
        XLM
      </h5>
      <div className="w-1/4 bg-zinc-300 rounded-xl shadow-lg border-2 border-black p-4 m-4">
        <Stack direction="vertical" gap={50}>
          <Stack direction="horizontal">
            <h4>Your daily reward: </h4>
            <Button variant="success" onClick={handleViewReward}>
              View Reward
            </Button>
            <h5 className="ms-auto">XLM {rewardAmt}</h5>
          </Stack>
          <h3>Click on button to claim</h3>
          <Button variant="success" onClick={handleClaimReward}>
            Claim Reward
          </Button>
        </Stack>
      </div>
    </Container>
  );
};

export default Reward;
