"use client";

import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { Hexagon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-purple-500" />
              <div className="absolute inset-0 blur-md bg-purple-500 opacity-30" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AXIOM</h1>
              <p className="text-xs text-gray-400">Proof of Intelligence</p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <Wallet>
              <ConnectWallet className="bg-purple-600 hover:bg-purple-700 transition-colors">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </div>
    </nav>
  );
}



