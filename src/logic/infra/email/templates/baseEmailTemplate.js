import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

function BaseEmailTemplate({ title = "Notificacao", message = "Mensagem" }) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, title),
    React.createElement(
      Body,
      {
        style: {
          backgroundColor: "#f4f4f5",
          fontFamily: "Segoe UI, Arial, sans-serif",
          padding: "24px 12px",
        },
      },
      React.createElement(
        Container,
        {
          style: {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "560px",
            margin: "0 auto",
            border: "1px solid #e4e4e7",
          },
        },
        React.createElement(
          Section,
          null,
          React.createElement(
            Heading,
            {
              as: "h2",
              style: { margin: "0 0 8px", color: "#18181b", fontSize: "22px" },
            },
            title
          ),
          React.createElement(Hr, { style: { borderColor: "#e4e4e7", margin: "16px 0" } }),
          React.createElement(
            Text,
            { style: { margin: 0, color: "#3f3f46", fontSize: "15px", lineHeight: "24px" } },
            message
          )
        )
      )
    )
  );
}

export default BaseEmailTemplate;