import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { ConnectButton } from "../web3/ConnectButton";
import { Stack } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSorobanReact } from "@soroban-react/core";
import { useRegisteredContract } from "@soroban-react/contracts";
import { nativeToScVal } from "@stellar/stellar-sdk";

function NavBar() {
  const router = useRouter();
  const [logInUser, setLogInUser] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;
  const contract = useRegisteredContract("localfoodstore");

  const navigateRegPage = () => {
    router.push("/register");
  };




  const handleLogin = async () => {
    if (!address) {
      toast.error("Please connect wallet to continue");
      return;
    }
    const result = await contract.invoke({
      method: "login",
      args: [nativeToScVal(address, { type: "address" })],
      signAndSend: true,
    });
    console.log("Login result:", result.returnValue._value);
    let value = result.returnValue._value;

    const decoder = new TextDecoder("utf-8");
    const decodedString = decoder.decode(value);
    if (decodedString === "User not found") {
      toast.error("User not Found... Register");
      localStorage.setItem("userLoginName", decodedString);
    } else {
      toast.success("User Login Successfully");
      localStorage.setItem("userLoginName", decodedString);
      setLogInUser(decodedString);
      setShowButtons(false);

      if(decodedString === "Admin" || decodedString === "admin" || decodedString === "ADMIN"){
        router.push("/admin");
      }
    }
  };

  const handleLogOut = () => {
    setShowButtons(true);
    setLogInUser("");
    localStorage.clear();
    toast.success("User Logged Out Successfully");
    router.push("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} href="/">
          D'VILLA Food Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse>
          <Nav
            className="me-auto my-3 my-lg-0"
            style={{ maxHeight: "150px" }}
            navbarScroll
          >
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/foodItems">
              Food Store
            </Nav.Link>
            <Nav.Link as={Link} href="/cart">
              Cart
            </Nav.Link>
            <Nav.Link as={Link} href="/reward">
              Rewards
            </Nav.Link>
            <Nav.Link as={Link} href="/viewOrders">
              View Orders
            </Nav.Link>

            {/* This tab is meant to be removed from the navbar to prevent customers 
            from fulfilling their orders without the presence of the delivery man 
            But its added here to help people navigate the application*/}
            <Nav.Link as={Link} href="/fulfillOrders">  
              Fulfill Order
            </Nav.Link>
          </Nav>
          <Stack direction="horizontal" gap={3}>
            <div className="font-bold">
              {logInUser ? `Hello ${logInUser}` : ""}
            </div>
            {showButtons ? (
              <Stack direction="horizontal" gap={2}>
                <Button variant="success" onClick={navigateRegPage}>
                  Register
                </Button>
                <Button variant="success" onClick={handleLogin}>
                  Login
                </Button>
              </Stack>
            ) : (
              ""
            )}
            {showButtons ? (
              ""
            ) : (
              <Button variant="success" onClick={handleLogOut}>
                Log Out
              </Button>
            )}
            <ConnectButton />
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
