"use client";

import { useState } from "react";
import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";

interface ApiKey {
  id: string;
  label: string;
  scope: string;
  createdAt: string;
  masked: string;
}

const initialKeys: ApiKey[] = [
  {
    id: "key-1",
    label: "Primary Trading Key",
    scope: "Read/Trade",
    createdAt: "2023-09-12",
    masked: "sk_live_4f3f****9d1"
  },
  {
    id: "key-2",
    label: "Analytics",
    scope: "Read-Only",
    createdAt: "2023-12-01",
    masked: "pk_live_dc74****92a"
  }
];

export default function UserProfilePanel() {
  const [keys, setKeys] = useState(initialKeys);
  const [formState, setFormState] = useState({
    displayName: "Nova Quant Labs",
    email: "ops@novalabs.io",
    timezone: "UTC",
    sessionTimeout: 30
  });

  const regenerateKey = (id: string) => {
    setKeys((prev) =>
      prev.map((key) =>
        key.id === id
          ? {
              ...key,
              masked: `sk_live_${crypto.randomUUID().slice(0, 4)}****${crypto.randomUUID().slice(-3)}`
            }
          : key
      )
    );
  };

  const removeKey = (id: string) => {
    setKeys((prev) => prev.filter((key) => key.id !== id));
  };

  return (
    <section aria-labelledby="profile-heading" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 id="profile-heading" className="text-lg font-semibold tracking-tight">
            Profile &amp; Access
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Manage account identity, session governance, and API credential lifecycle.
          </p>
        </div>
        <UserCircleIcon className="h-10 w-10 text-tealAccent" aria-hidden="true" />
      </div>

      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <form className="space-y-4 rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder">
          <h3 className="text-xs font-semibold uppercase text-slate-400">Account Settings</h3>
          <label className="block text-sm text-slate-300">
            Display Name
            <input
              type="text"
              value={formState.displayName}
              onChange={(event) => setFormState({ ...formState, displayName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={formState.email}
              onChange={(event) => setFormState({ ...formState, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Timezone
            <select
              value={formState.timezone}
              onChange={(event) => setFormState({ ...formState, timezone: event.target.value })}
              className="mt-1 w-full rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="CET">CET</option>
              <option value="SGT">SGT</option>
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Session Timeout (minutes)
            <input
              type="number"
              min={5}
              max={120}
              value={formState.sessionTimeout}
              onChange={(event) =>
                setFormState({ ...formState, sessionTimeout: Number(event.target.value) })
              }
              className="mt-1 w-32 rounded-lg border border-panelBorder bg-panelBg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
            />
          </label>
          <button
            type="button"
            className="w-full rounded-full bg-tealAccent px-4 py-2 text-sm font-semibold text-dashboardBg transition hover:bg-tealAccent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
            aria-label="Save profile settings"
          >
            Save Changes
          </button>
        </form>

        <section className="flex flex-col rounded-2xl bg-panelBg/70 p-4 shadow-panel ring-1 ring-panelBorder">
          <header className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-400">API Keys</h3>
              <p className="mt-1 text-xs text-slate-400">
                Rotate secrets regularly and scope permissions to minimum required access.
              </p>
            </div>
            <KeyIcon className="h-5 w-5 text-tealAccent" aria-hidden="true" />
          </header>
          <ul className="mt-3 space-y-3" role="list">
            {keys.map((key) => (
              <li key={key.id} className="rounded-xl border border-panelBorder bg-panelBg/60 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">{key.label}</p>
                    <p className="text-xs text-slate-400">{key.scope}</p>
                  </div>
                  <span className="text-xs text-slate-400">Created {key.createdAt}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <code className="rounded bg-black/50 px-2 py-1 text-xs text-tealAccent">{key.masked}</code>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => regenerateKey(key.id)}
                      className="rounded-full border border-panelBorder px-3 py-1 text-xs transition hover:border-tealAccent hover:text-tealAccent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
                    >
                      Rotate
                    </button>
                    <button
                      type="button"
                      onClick={() => removeKey(key.id)}
                      className="rounded-full border border-panelBorder px-3 py-1 text-xs text-rose-300 transition hover:border-rose-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-auto rounded-full border border-dashed border-tealAccent/60 px-4 py-2 text-sm text-tealAccent transition hover:border-tealAccent hover:bg-tealAccent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tealAccent"
          >
            Generate New Key
          </button>
        </section>
      </div>
    </section>
  );
}
