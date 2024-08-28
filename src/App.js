import React, { useState } from "react";
import { Image, Upload, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./App.css";

const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function App() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [response, setResponse] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    setResponse(file?.response?.response);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="App bg-light">
      <div className="bg-secondary bg-gradient text-light p-4">
        <h1>OpenAI Vision</h1>
      </div>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-1 mx-auto mt-4">
            <Upload
              action="http://localhost:8000/uploadfile"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </div>
          <p>
            {response ? null : (
              <div>
                <Empty />
              </div>
            )}
            {response ? <div>{response}</div> : null}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
