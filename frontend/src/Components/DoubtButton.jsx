import React, { useRef } from "react";
import "./DoubtButton.css";
import { Link } from "react-router-dom";

const DoubtButton = () => {
  const buttonRef = useRef(null);
  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const onMouseDown = (e) => {
    const button = buttonRef.current;
    pos = {
      left: button.offsetLeft,
      top: button.offsetTop,
      x: e.clientX,
      y: e.clientY,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    const button = buttonRef.current;
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    button.style.left = `${pos.left + dx}px`;
    button.style.top = `${pos.top + dy}px`;
    button.style.right = "auto";
    button.style.bottom = "auto";
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <Link
      to="/AskAI"
      className="doubtButton-fixed"
      ref={buttonRef}
      style={{
        left: "auto",
        top: "auto",
        right: 32,
        bottom: 32,
        position: "fixed",
      }}
      onMouseDown={onMouseDown}
      draggable={false}
    >
      <img
        src="/teacher.png"
        alt="Indian Teacher"
        className="chatbot-icon"
        draggable={false}
      />
    </Link>
  );
};

export default DoubtButton;