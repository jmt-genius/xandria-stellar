"use client";

import { useState } from "react";
import { isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import { getContractClient, xlmToStroops } from "@/lib/stellar";
import { NETWORK_PASSPHRASE } from "@/lib/constants";
import { uploadFileToPinata } from "@/utils/pinata";

export default function UploadBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    supply: "100",
  });
  const [isSpecial, setIsSpecial] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      if (name === "coverImage") setCoverImage(e.target.files[0]);
      else if (name === "bookFile") setBookFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const { isConnected: connected } = await isConnected();
      if (!connected) {
        alert("Please connect your Freighter wallet first.");
        setIsUploading(false);
        return;
      }

      const { address } = await requestAccess();
      if (!address) {
        alert("Wallet access denied.");
        setIsUploading(false);
        return;
      }

      if (!coverImage || !bookFile) {
        alert("Please upload both cover image and book file.");
        setIsUploading(false);
        return;
      }

      const coverUrl = await uploadFileToPinata(coverImage);
      const bookUrl = await uploadFileToPinata(bookFile);

      const client = getContractClient(address);
      const priceInStroops = xlmToStroops(parseFloat(formData.price));
      const supply = parseInt(formData.supply);

      const tx = await client.publish_book({
        author: address,
        title: formData.title,
        author_name: formData.author,
        price: priceInStroops,
        cover_uri: coverUrl,
        book_uri: bookUrl,
        is_special: isSpecial,
        supply: isSpecial ? supply : 0,
      });

      const { result } = await tx.signAndSend({
        signTransaction: async (xdr: string) => {
          const { signedTxXdr } = await signTransaction(xdr, {
            networkPassphrase: NETWORK_PASSPHRASE,
          });
          return { signedTxXdr };
        },
      });

      alert(`Book published successfully! ID: ${result}`);
    } catch (error) {
      console.error("Error publishing book:", error);
      alert("Failed to publish book. See console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full bg-background border border-border rounded-md px-4 py-3 text-text-primary font-body text-sm focus:outline-none focus:border-accent/50 placeholder:text-text-muted";

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col items-center">
      <h1 className="font-display text-3xl text-text-primary mb-8 text-center">
        Publish Your Masterpiece
      </h1>

      <div className="w-full max-w-[560px] bg-surface border border-border rounded-xl p-8 shadow-[var(--shadow-card)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-body text-text-secondary mb-1.5">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-body text-text-secondary mb-1.5">
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <span className="block text-sm font-body text-text-secondary mb-2">
              Edition Type
            </span>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
                <input
                  type="radio"
                  checked={!isSpecial}
                  onChange={() => setIsSpecial(false)}
                  className="accent-accent"
                />
                Normal Edition
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
                <input
                  type="radio"
                  checked={isSpecial}
                  onChange={() => setIsSpecial(true)}
                  className="accent-accent"
                />
                Special Edition
              </label>
            </div>
          </div>

          {isSpecial && (
            <div>
              <label className="block text-sm font-body text-text-secondary mb-1.5">
                Total Supply
              </label>
              <input
                type="number"
                name="supply"
                value={formData.supply}
                onChange={handleInputChange}
                required
                min="1"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-body text-text-secondary mb-1.5">
              Price (XLM)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-body text-text-secondary mb-1.5">
                Cover Image
              </label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-body file:font-medium file:bg-accent file:text-background hover:file:opacity-90 file:cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-text-secondary mb-1.5">
                Book File (PDF/EPUB)
              </label>
              <input
                type="file"
                name="bookFile"
                accept=".pdf,.epub"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-body file:font-medium file:bg-accent file:text-background hover:file:opacity-90 file:cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3.5 font-body font-medium text-sm transition-opacity ${
              isUploading
                ? "bg-surface-hover text-text-muted cursor-not-allowed"
                : "bg-accent text-background hover:opacity-90"
            }`}
          >
            {isUploading ? "Publishing..." : "Mint & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
