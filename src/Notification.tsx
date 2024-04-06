import React from "react";

interface Props {
  title: string;
  text: string;
  show: boolean;
  icon: string;
  onHide: () => void
}

export const Notification = (props: Props) => {
  return (
        <div className={`pos-fixed m-3 p-3 top-0 right-0 border notification ${props.show ?"show":"hide"}`} onClick={props.onHide}>
          <div className="d-flex align-items-center">
            <span className="icon">{props.icon}</span>
          <div className="ms-1">
            <div className="text-bold">{props.title}</div>
            <div>{props.text}</div>
          </div>
          </div>
        </div>
  );
};
