export const createFile = async (hider: string, hint: string, date: string) => {
  try {
    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${process.env.JWT}`,
        },
        body: JSON.stringify({
          pinataContent: {
            hider: hider,
            hint: hint,
            date: date,
          },
          pinataOptions: {
            groupId: '7e889a34-bd83-4d19-ace6-8d0a7accef89',
          },
          pinataMetadata: {
            name: 'pinnie.json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    const json = await response.json(); // No need for JSON.parse
    if (!json || !json.IpfsHash) {
      throw new Error('Invalid response format: Missing IpfsHash');
    }
  } catch (error) {
    console.error('createFile error:', error);
  }
};

export const getGroupItems = async () => {
  try {
    const response = await fetch(
      'https://api.pinata.cloud/data/pinList?groupId=7e889a34-bd83-4d19-ace6-8d0a7accef89',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${process.env.JWT}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    const json = await response.json(); // No need for JSON.parse
    if (!json || !json.IpfsHash) {
      return json;
    }
  } catch (error) {
    console.error('createFile error:', error);
  }
};

export const getItem = async (id: string) => {
  try {
    const response = await fetch(
      `https://pink-petite-leech-526.mypinata.cloud/ipfs/${id}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${process.env.JWT}`,
        },
      }
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
