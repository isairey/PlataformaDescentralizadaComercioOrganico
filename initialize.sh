#!/bin/bash

set -e

NETWORK="testnet"

STELLAR_RPC_HOST="$2"

PATH=./target/bin:$PATH

if [[ -f "./dvillaLocalFoodStore/localfoodstore_id" ]]; then
  echo "Found existing './dvillaLocalFoodStore' directory; already initialized."
  exit 0
fi

stellar="./target/bin/stellar"
if [[ -f "$stellar" ]]; then
  current=$($stellar --version | head -n 1 | cut -d ' ' -f 2)
  desired=$(cat .cargo/config.toml | grep -oE -- "--version\s+\S+" | awk '{print $2}')
  if [[ "$current" != "$desired" ]]; then
    echo "Current pinned stellar binary: $current. Desired: $desired. Building stellar binary."
    cargo install --locked stellar-cli --features opt
    # cargo install_stellar
  else
    echo "Using stellar binary from ./target/bin"
  fi
else
  echo "Building pinned stellar-cli binary"
  cargo install --locked stellar-cli --features opt
  # cargo install_stellar
fi

if [[ "$STELLAR_RPC_HOST" == "" ]]; then
  # If stellar-cli is called inside the stellar-preview docker container,
  # it can call the stellar standalone container just using its name "stellar"
  if [[ "$IS_USING_DOCKER" == "true" ]]; then
    STELLAR_RPC_HOST="http://stellar:8000"
    STELLAR_RPC_URL="$STELLAR_RPC_HOST"
  elif [[ "$NETWORK" == "futurenet" ]]; then
    STELLAR_RPC_HOST="https://rpc-futurenet.stellar.org:443"
    STELLAR_RPC_URL="$STELLAR_RPC_HOST"
  elif [[ "$NETWORK" == "testnet" ]]; then
    STELLAR_RPC_HOST="https://soroban-testnet.stellar.org:443"
    STELLAR_RPC_URL="$STELLAR_RPC_HOST"
  else
    # assumes standalone on quickstart, which has the stellar/rpc path
    STELLAR_RPC_HOST="http://localhost:8000"
    STELLAR_RPC_URL="$STELLAR_RPC_HOST/stellar/rpc"
  fi
else
  STELLAR_RPC_URL="$STELLAR_RPC_HOST"
fi

case "$1" in
standalone)
  STELLAR_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
  FRIENDBOT_URL="$STELLAR_RPC_HOST/friendbot"
  ;;
futurenet)
  STELLAR_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
  FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
  ;;
  testnet)
  STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
  FRIENDBOT_URL="https://friendbot.stellar.org/"
  ;;
*)
  echo "Usage: $0 standalone|futurenet [rpc-host]"
  exit 1
  ;;
esac

echo "Using $NETWORK network"
echo "  RPC URL: $STELLAR_RPC_URL"
echo "  Friendbot URL: $FRIENDBOT_URL"

echo Add the $NETWORK network to cli client
stellar network add \
  --rpc-url "$STELLAR_RPC_URL" \
  --network-passphrase "$STELLAR_NETWORK_PASSPHRASE" "$NETWORK"

echo Add $NETWORK to .dvillaLocalFoodStore for use with npm scripts
mkdir -p dvillaLocalFoodStore
echo $NETWORK >./dvillaLocalFoodStore/network
echo $STELLAR_RPC_URL >./dvillaLocalFoodStore/rpc-url
echo "$STELLAR_NETWORK_PASSPHRASE" >./dvillaLocalFoodStore/passphrase
echo "{ \"network\": \"$NETWORK\", \"rpcUrl\": \"$STELLAR_RPC_URL\", \"networkPassphrase\": \"$STELLAR_NETWORK_PASSPHRASE\" }" >./shared/config.json


if !(soroban config identity ls | grep token-admin 2>&1 >/dev/null); then
  echo Create the token-admin identity
  soroban config identity generate token-admin
fi
DVILLA_ADMIN_ADDRESS="$(soroban config identity address token-admin)"


# This will fail if the account already exists, but it'll still be fine.
echo Fund token-admin account from friendbot
echo $DVILLA_ADMIN_ADDRESS
curl --silent -X POST "$FRIENDBOT_URL?addr=$DVILLA_ADMIN_ADDRESS" >/dev/null

ARGS="--network $NETWORK --source token-admin"

echo Build contracts
make build   # this will work if there's a Makefile in the root of the project

echo Deploy the dvilla token contract
DVILLA_ID="$(
  stellar contract deploy $ARGS \
    --wasm target/wasm32-unknown-unknown/release/dvilla_token.wasm \
    --alias dvilla
)"
echo "Contract deployed succesfully with ID: $DVILLA_ID"
echo -n "$DVILLA_ID" > dvillaLocalFoodStore/dvilla_token_id

# echo Deploy the localfoodstore contract
LOCALFOODSTORE_ID="$(
  stellar contract deploy $ARGS \
    --wasm target/wasm32-unknown-unknown/release/stellar_localfoodstore_contract.wasm \
    --alias localfoodstore
)"
echo "Contract deployed succesfully with ID: $LOCALFOODSTORE_ID"
echo -n "$LOCALFOODSTORE_ID" > dvillaLocalFoodStore/localfoodstore_id

# echo "Initialize the dvilla token contract"
# stellar contract invoke \
#   $ARGS \
#   --id dvilla \
#   -- \
#   initialize \
#   --symbol DVLA \
#   --decimal 7 \
#   --name dvilla \
#   --admin "$DVILLA_ADMIN_ADDRESS"

# //worked 1
echo "Initialize the localfoodstore contract"
stellar contract invoke \
  $ARGS \
  --id localfoodstore \
  -- \
  initialize \
  --recipient "$LOCALFOODSTORE_ID" \
  --target_amount "1000000000000" \
  --token "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC" # this is the official XLM token testnet address



# echo "Transfer 1000XLM TO the localfoodstore contract"
# stellar contract invoke \
#   --network $NETWORK --source token-admin \
#   --id localfoodstore \
#   -- \
#   transfer_xlm \
#   --from "$DVILLA_ADMIN_ADDRESS" \
#   --to "$LOCALFOODSTORE_ID" \
#   --amount "10000000000"

# echo Register user details to blockchain
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   register \
#   --user_address "GD5UXQC3HGHAP7ZQVRYUWPK6RELHYOF5CDD22NUOAIKU4PK3CLB2QJ7R" \
#   --name "Chieloka" \
#   --email "madubugwuchieloka6@gmail.com"

# echo Login user
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   login \
#   --user_address "GD5UXQC3HGHAP7ZQVRYUWPK6RELHYOF5CDD22NUOAIKU4PK3CLB2QJ7R"

# echo Get user name to check if user is logged In
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   get_user_name \
#   --user_address "GD5UXQC3HGHAP7ZQVRYUWPK6RELHYOF5CDD22NUOAIKU4PK3CLB2QJ7R"

# echo User place order1
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   place_order \
#   --user "$DVILLA_ADMIN_ADDRESS" \
#   --amount "6000000000" 


# echo Get user Order1
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   get_order \
#   --order_id "1"


# echo Get user Reward that is 2% of total order value above 500000000
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   get_total_user_rewards \
#   --user "$DVILLA_ADMIN_ADDRESS"


# echo User receive Reward - return true if user has received reward
# stellar contract invoke \
#   $ARGS \
#   --id localfoodstore \
#   -- \
#   process_user_reward \
#   --user "$DVILLA_ADMIN_ADDRESS"

echo "Done"