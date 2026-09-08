import React from "react";
import { Page } from "../Page";

const styles = `
    .ta-api-page,
    .ta-api-page * {
        box-sizing: border-box;
    }

    .ta-api-page {
        min-height: 100vh;
        width: 100vw;
        display: grid;
        place-items: center;
        margin: 0;
        color: #17364b;
        background: #f7f9f8;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .ta-content {
        width: min(430px, 100%);
        padding: 32px 24px;
        text-align: center;
    }

    .ta-graphic {
        display: block;
        width: 180px;
        height: auto;
        margin: 0 auto 24px;
    }

    .ta-title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.2;
    }

    .ta-message {
        margin: 12px 0 0;
        color: #637582;
        font-size: 15px;
        line-height: 1.6;
    }

    .ta-data-one,
    .ta-data-two,
    .ta-data-three {
        animation: ta-drop 2.1s ease-in infinite;
    }

    .ta-data-two {
        animation-delay: 0.7s;
    }

    .ta-data-three {
        animation-delay: 1.4s;
    }

    @keyframes ta-drop {
        0% {
            opacity: 0;
            transform: translateY(-8px);
        }
        20%, 75% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(34px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .ta-data-one,
        .ta-data-two,
        .ta-data-three {
            animation: none;
        }
    }
`;

const DataGraphic = () => (
  <svg
    className="ta-graphic"
    viewBox="0 0 180 135"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M47 48H133C139.6 48 145 53.4 145 60V111H35V60C35 53.4 40.4 48 47 48Z"
      fill="white"
      stroke="#17364B"
      strokeWidth="4"
    />
    <path
      d="M25 111H155L146 123H34L25 111Z"
      fill="#D9EEE8"
      stroke="#17364B"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    <path d="M75 75L90 66L105 75V93L90 102L75 93V75Z" fill="#168F8A" />
    <path
      d="M75 75L90 84L105 75M90 84V102"
      stroke="white"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    <path
      d="M90 15V47"
      stroke="#168F8A"
      strokeOpacity="0.25"
      strokeWidth="2"
      strokeDasharray="3 5"
    />
    <rect
      className="ta-data-one"
      x="84"
      y="14"
      width="12"
      height="12"
      rx="3"
      fill="#FF8A68"
    />
    <rect
      className="ta-data-two"
      x="84"
      y="14"
      width="12"
      height="12"
      rx="3"
      fill="#F5B85C"
    />
    <rect
      className="ta-data-three"
      x="84"
      y="14"
      width="12"
      height="12"
      rx="3"
      fill="#168F8A"
    />
  </svg>
);

export class APIPage extends Page {
  id = "api";

  content = () => (
    <main className="ta-api-page">
      <style>{styles}</style>
      <section className="ta-content" aria-labelledby="collection-title">
        <DataGraphic />
        <h1 className="ta-title" id="collection-title">
          Don’t close this tab
        </h1>
        <p className="ta-message">
          This is TinkerCAD Assistant’s background worker. You can switch
          tabs—just leave this one open.
        </p>
      </section>
    </main>
  );
}
