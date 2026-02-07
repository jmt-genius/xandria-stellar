// Use env vars if available (backend engineer pattern), fallback to hardcoded defaults
export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID || "CAON5KLCJJLLRJYXKTJCMZG5H27SM5GP4RWQJLKH3P4O3IDDEF24B4GR";
export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
export const XLM_TOKEN_ADDRESS = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
export const STROOPS_PER_XLM = 10_000_000;
export const PINATA_GATEWAY = "https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/";
