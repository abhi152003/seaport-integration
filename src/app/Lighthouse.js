import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import "dotenv/config";

const apiKey = "7bb8741a.7c6c277ac052416494c93a0d93a52a0e"

function App() {
  const [file, setFile] = useState(null);
  const [texts, setTexts] = useState({});
  const [output, setOutput] = useState(null);

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - ((progressData?.total / progressData?.uploaded)?.toFixed(2) || 0);
    console.log(percentageDone);
  };

  const uploadFile = async () => {
    if (file) {
      const fileOutput = await lighthouse.upload(
        file,
        "7bb8741a.7c6c277ac052416494c93a0d93a52a0e",
        false,
        null,
        progressCallback
      );

      const textObject = { ...texts, fileURI: fileOutput.data.Hash };
      const response = await lighthouse.uploadText(textObject, apiKey);

      console.log(response);
      console.log("File Status:", fileOutput);
      console.log(
        "Visit at https://gateway.lighthouse.storage/ipfs/" + fileOutput.data.Hash
      );

      setOutput({
        objectURI: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`,
        fileURI: `https://gateway.lighthouse.storage/ipfs/${fileOutput.data.Hash}`,
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  const handleTextChange = (e) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="App">
      <h1>Lighthouse</h1>
      <input onChange={handleFileChange} type="file" />
      <br />
      <input
        name="text1"
        placeholder="Text 1"
        onChange={handleTextChange}
        value={texts.text1 || ""}
      />
      <br />
      <input
        name="text2"
        placeholder="Text 2"
        onChange={handleTextChange}
        value={texts.text2 || ""}
      />
      <br />
      <br />
      <button onClick={uploadFile}>Submit</button>
      {output && (
        <div>
          <p>Object URI: {output.objectURI}</p>
          <p>File URI: {output.fileURI}</p>
        </div>
      )}
    </div>
  );
}

export default App;