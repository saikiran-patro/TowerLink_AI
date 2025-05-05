import { useState, useRef } from "react";
import { Send, Images, X, Smile,Bot } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage } from "../Store/chatSlice";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';


const ChatInput = ({ chatInputRef }) => {
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState(40);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const maxHeight = 150;
  const receiverId = useSelector((data) => data.chat.currentSelectedUser.userId);
  const dispatch = useDispatch();
  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessage((prev) => prev + "\n");
      if (height === 40) {
        setHeight((prevHeight) => Math.min(prevHeight + 30, maxHeight));
      }
    }
  };

  const handleMouseLeave = () => {
    setHeight(40);
  };

  const compressImage = (file, maxWidth = 300, maxHeight = 300) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = maxWidth;
          canvas.height = maxHeight;
          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const compressedBase64 = await compressImage(file);
    setImagePreview(compressedBase64);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imagePreview) return;

    let payload = {
      text: message,
      image: imagePreview,
    };

    try {
      const endpoint = import.meta.env.MODE==="development"? `http://localhost:5000/api/messages/send/${receiverId}`:`api/messages/send/${receiverId}`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const { data } = await response.json();
      if (response.ok) {
        toast.success("Message sent successfully");
        setMessage("");
        fileInputRef.current.value = "";
        setImagePreview(null);
        setShowEmojiPicker(false);
        dispatch(addNewMessage(data));
      } else {
        toast.error("Error sending message");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Only show emojis related to space
  const spaceKeywords = ["rocket", "star", "alien", "moon", "planet", "galaxy", "spaceship"];
  const filterSpaceEmojis = (emoji) => {
    const lowerName = emoji.name.toLowerCase();
    return spaceKeywords.some((keyword) => lowerName.includes(keyword));
  };

  return (
    <div className="bg-black relative" ref={chatInputRef}>
      {imagePreview && (
        <div className="mx-auto w-4/5 flex justify-between items-center rounded-[12px]">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-25 h-25 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 cursor-pointer -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
  
         <div style={{ position: 'absolute', bottom: '60px', right: '10px', zIndex:'50' }}  className="emoji-picker-wrapper">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
  
      )}

      <form onSubmit={handleSendMessage} className="w-[100%]">
        <div className="bg-[#2b2b2d] mb-2.5 mx-auto w-4/5 flex justify-between items-center rounded-[12px] p-5 gap-4 chatInputMob relative">
          <textarea
            ref={textareaRef}
            className="w-full text-[16px] text-white outline-none border-0 bg-[#2b2b2d] p-2 rounded-lg resize-none overflow-y-auto"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onMouseLeave={handleMouseLeave}
            style={{
              height: "40px",
              minHeight: `${height}px`,
              maxHeight: `${maxHeight}px`,
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="flex justify-center cursor-pointer items-center"
          >
            <Bot className="text-[#dee1e9]" />
          </button>

          {/* Image Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex justify-center cursor-pointer items-center"
          >
            <Images className="text-[#dee1e9]" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() && !imagePreview}
            className="flex justify-center cursor-pointer items-center"
          >
            <Send
              className={
                !message.trim() && !imagePreview ? "text-gray-500" : "text-[#dee1e9]"
              }
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
