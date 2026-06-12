import React from "react";
import ReactDOM from "react-dom/client";
import { CosplayHeroAnimation } from "./components/CosplayHeroAnimation";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="demo-page">
      <CosplayHeroAnimation
        avatarSilhouetteSrc="/assets/miku-avatar.png"
        wigPhotoSrc="/assets/finished-wig.png"
      />
    </main>
  </React.StrictMode>,
);
