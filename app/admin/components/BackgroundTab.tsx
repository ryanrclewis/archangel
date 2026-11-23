"use client";

import { useState } from "react";
import type { SiteConfig } from "./types";

type Props = {
  siteConfig: SiteConfig;
  images: string[];
  onSelectImage: (filename: string) => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  onSaveSiteDetails: (updates: Partial<SiteConfig>) => Promise<void>;
};

export function BackgroundTab({
  siteConfig,
  images,
  onSelectImage,
  onUploadImage,
  onSaveSiteDetails,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [contactEmail, setContactEmail] = useState(siteConfig.contactEmail ?? "");
  const [twitterHandle, setTwitterHandle] = useState(siteConfig.twitterHandle ?? "");
  const [savingDetails, setSavingDetails] = useState(false);

  const current = siteConfig.backgroundImage ?? "";

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      await onUploadImage(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      await onSaveSiteDetails({
        contactEmail: contactEmail.trim(),
        twitterHandle: twitterHandle.trim(),
      });
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <div>
      <div className="admin-panel-header">
        <div>
          <h2>Background & Site Identity</h2>
          <p>
            Choose or upload the backdrop painting shown behind the parchment shell, and manage public contact details.
          </p>
        </div>
        <span className="admin-badge admin-badge--ink">Active: {current || "None"}</span>
      </div>

      {/* Drag & drop upload zone */}
      <label
        className={`admin-dropzone ${dragging ? "is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <strong style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 500 }}>
          {uploading ? "Uploading image…" : "Drop a background image here, or click to browse"}
        </strong>
        <span className="admin-stat-meta">Supports JPG, PNG, WEBP, AVIF · Automatically activates on upload</span>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            await handleFile(file);
            e.target.value = "";
          }}
        />
      </label>

      <div className="admin-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
        <div className="admin-section-header">
          <h3 className="admin-section-title">Uploaded Backdrops ({images.length})</h3>
        </div>
        <div className="admin-image-grid">
          {images.map((img) => {
            const active = img === current;
            return (
              <button
                key={img}
                type="button"
                className={`admin-image-card ${active ? "is-active" : ""}`}
                onClick={() => onSelectImage(img)}
                title={`Activate ${img}`}
              >
                <img src={`/${img}`} alt={img} />
                <span className="admin-image-caption">
                  {active ? "✓ " : ""}
                  {img}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Site contact identity */}
      <form className="admin-section" onSubmit={handleSaveDetails}>
        <div className="admin-section-header">
          <h3 className="admin-section-title">Public Contact Details</h3>
          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--sm"
            disabled={savingDetails}
          >
            {savingDetails ? "Saving…" : "Save Details"}
          </button>
        </div>
        <div className="admin-field-grid" style={{ marginBottom: 0 }}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="site-email">
              Contact Email
            </label>
            <input
              id="site-email"
              type="email"
              className="admin-input admin-input--mono"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="site-twitter">
              X / Twitter Handle
            </label>
            <input
              id="site-twitter"
              className="admin-input admin-input--mono"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
