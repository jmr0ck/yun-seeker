/**
 * Solana Payment Service
 * Handles wallet connection and SOL payments for premium features
 */

import { Connection, Transaction, SystemProgram, PublicKey, Keypair } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Polyfill buffer
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// RPC endpoint (using public RPC for demo)
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// Premium feature prices (in SOL)
export const PRICES = {
  // Base usage
  EXTRA_READING: 0.005, // after 1 free/day

  // Premium upgrades
  DETAILED_CHART: 0.01, // Detailed 8-character chart analysis
  LOVE_COMPATIBILITY: 0.005, // Love compatibility reading
  FINANCE_FORECAST: 0.005, // Finance forecast
  CAREER_GUIDANCE: 0.005, // Career guidance
  DECISION_READING: 0.01, // Major decision reading
  PURPLE_STAR_FULL: 0.02, // Full Purple Star analysis
  LUCKY_NUMBERS_PRO: 0.001, // Pro lottery numbers
};

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
}

export type PendingPayment = {
  reference: string; // base58 pubkey
  to: string; // recipient pubkey
  minLamports: number;
  createdAtMs: number;
};

class SolanaPaymentService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC, 'confirmed');
  }

  // Check wallet balance
  async getBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  // Create a Solana Pay transfer request URI + reference (for client-side verification)
  createSolanaPayUri(opts: {
    to: string;
    amountSol: number;
    label?: string;
    message?: string;
  }): { uri: string; pending: PendingPayment } {
    const { to, amountSol, label = 'yun (運)', message = 'Payment' } = opts;

    const reference = Keypair.generate().publicKey;
    const minLamports = Math.round(amountSol * 1e9);

    const params = new URLSearchParams({
      amount: String(amountSol),
      label,
      message,
      reference: reference.toBase58(),
    });

    const uri = `solana:${to}?${params.toString()}`;

    return {
      uri,
      pending: {
        reference: reference.toBase58(),
        to,
        minLamports,
        createdAtMs: Date.now(),
      },
    };
  }

  // Verify a payment by looking up any tx that includes the reference key.
  // Best-effort: we confirm the tx exists and the destination appears in account keys.
  async verifyPaymentByReference(pending: PendingPayment): Promise<{ ok: boolean; signature?: string; reason?: string }> {
    try {
      const ref = new PublicKey(pending.reference);
      const sigs = await this.connection.getSignaturesForAddress(ref, { limit: 10 });
      if (!sigs.length) return { ok: false, reason: 'No payment found yet' };

      // Take the most recent signature
      const signature = sigs[0].signature;
      const tx = await this.connection.getTransaction(signature, { maxSupportedTransactionVersion: 0 });
      if (!tx) return { ok: false, reason: 'Transaction not available yet' };

      const keys = tx.transaction.message.getAccountKeys().staticAccountKeys.map((k) => k.toBase58());
      if (!keys.includes(pending.to)) {
        return { ok: false, reason: 'Found tx, but destination does not match' };
      }

      // NOTE: amount verification is hard without full instruction parsing here.
      // For MVP: require destination + reference hit.
      return { ok: true, signature };
    } catch (e: any) {
      return { ok: false, reason: String(e?.message ?? e) };
    }
  }

  // Create payment transaction (legacy; not used in MVP)
  async createPaymentTx(
    fromAddress: string,
    amount: number
  ): Promise<Transaction> {
    const transaction = new Transaction();
    
    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromAddress),
        // NOTE: demo treasury — set to your creator wallet for hackathon MVP
        toPubkey: new PublicKey('8HCddiWRKs8EnYL5UbpRjKJwNdpVPoaWrWKcX683V7qQ'),
        lamports: amount * 1e9,
      })
    );
    
    // Set fee payer
    transaction.feePayer = new PublicKey(fromAddress);
    
    // Get recent blockhash
    const blockhash = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;
    
    return transaction;
  }

  // Format wallet address for display
  formatAddress(address: string): string {
    if (!address || address.length < 8) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  // Check if address is valid
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
}

export const solanaPayment = new SolanaPaymentService();
export default solanaPayment;
