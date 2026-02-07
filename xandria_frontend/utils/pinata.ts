const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const uploadFileToPinata = async (file: File): Promise<string> => {
    if (!PINATA_JWT) throw new Error("Pinata JWT not found");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Failed to upload file to Pinata: ${res.statusText}`);
    }

    const data = await res.json();
    return `https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${data.IpfsHash}`;
};

export const uploadJSONToPinata = async (json: any): Promise<string> => {
    if (!PINATA_JWT) throw new Error("Pinata JWT not found");

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify(json),
    });

    if (!res.ok) {
        throw new Error(`Failed to upload JSON to Pinata: ${res.statusText}`);
    }

    const data = await res.json();
    return `https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${data.IpfsHash}`;
};
