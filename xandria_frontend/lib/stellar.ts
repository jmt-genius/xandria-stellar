import { Client } from "hello-world-contract";
import { CONTRACT_ID, NETWORK_PASSPHRASE, RPC_URL, STROOPS_PER_XLM } from "./constants";

export const getContractClient = (publicKey?: string) =>
  new Client({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    ...(publicKey ? { publicKey } : {}),
  });

export const stroopsToXlm = (stroops: bigint | number): number =>
  Number(stroops) / STROOPS_PER_XLM;

export const xlmToStroops = (xlm: number): bigint =>
  BigInt(Math.floor(xlm * STROOPS_PER_XLM));

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export const formatMintNumber = (num: number): string =>
  `No. ${String(num).padStart(4, "0")}`;
