import React, { useState } from 'react';
import {
  BellIcon,
  BetweenVerticalEndIcon,
  Key,
  KeyIcon,
  PersonStandingIcon,
  Plus,
} from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { DS } from '@/constants/designSystem';

export default function Settings() {
  const [tab, setTab] = useState('general');
  console.log('tab:', tab);
  return (
    <section className="bg-background w-full min-h-screen pt-20 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
      {/* sidebar */}
      <SideBar tab={tab} setTab={setTab} />
      {/* main content */}
      <main>
        {
          {
            general: <General />,
            security: <Security />,
            notifications: <Notifications />,
            organization: <Organization />,
            appearance: <Appearance />,
            beta: <Beta />,
          }[tab]
        }
      </main>
    </section>
  );
}

//--------------custom components----------------//

function ControlButton({
  icon: Icon,
  label,
  description,
  isOpened = false,
  onClick,
}) {
  return (
    <button
      className={`flex items-center gap-4
      w-full py-2 px-1  rounded-lg
      transition opacity-80 hover:opacity-100
      ${isOpened ? 'bg-hover text-foreground' : 'text-muted-foreground'}
    `}
      onClick={onClick}
    >
      <Icon className="w-6 h-6 text-foreground" />
      <div className="flex-1 text-left overflow-hidden">
        <p className="font-semibold">{label}</p>
      </div>
    </button>
  );
}

function SideBar({ tab, setTab }) {
  return (
    <aside
      className="
        py-6
        px-0
        rounded-lg
        flex-col
        gap-6
        text-foreground
        sticky
        top-20

        self-start
        w-[250px]
        h-full
        shadow-lg
        shadow-gray-200/10
        hidden
        md:flex
      "
    >
      <p
        className="
         text-xs font-semibold uppercase tracking-wider
        "
      >
        Personal Settings
      </p>
      <div className="space-y-2.5">
        <ControlButton
          icon={PersonStandingIcon}
          label="General"
          description="Manage your general account settings"
          isOpened={tab === 'general'}
          onClick={() => setTab('general')}
        />
        <ControlButton
          icon={KeyIcon}
          label="Security"
          description="Manage your security settings"
          isOpened={tab === 'security'}
          onClick={() => setTab('security')}
        />
        <ControlButton
          icon={BellIcon}
          label="Notifications"
          description="Manage your notification preferences"
          isOpened={tab === 'notifications'}
          onClick={() => setTab('notifications')}
        />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider">
        Organization settings
      </p>
      <ControlButton
        icon={Plus}
        label="New Organization"
        description="Create a new organization"
        isOpened={tab === 'organization'}
        onClick={() => setTab('organization')}
      />

      <p className="text-xs font-semibold uppercase tracking-wider">
        App settings
      </p>

      <ControlButton
        icon={BetweenVerticalEndIcon}
        label="Appearance"
        description="Customize the look and feel of the app"
        isOpened={tab === 'appearance'}
        onClick={() => setTab('appearance')}
      />

      <ControlButton
        icon={Key}
        label="Beta features"
        description="Try out new features"
        isOpened={tab === 'beta'}
        onClick={() => setTab('beta')}
      />
    </aside>
  );
}

function Section({ title, description, children }) {
  return (
    <div className={`${DS.cards.flat} ${DS.cards.padding.md} space-y-4`}>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function General() {
  return (
    <div
      className={`${DS.containers.mdPadded} ${DS.spacing.section.sm} space-y-8`}
    >
      {/* Page Header */}
      <div>
        <h1 className={DS.typography.h2}>General</h1>
        <p className={DS.typography.subtitle}>Manage your account details</p>
      </div>

      {/* Email Address */}
      <Section
        title="Email address"
        description="The email address associated with your account"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            disabled
            value="etabebe@gmail.com"
            className="w-full sm:max-w-md rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground border border-border"
          />
          <button className={`${DS.buttons.outlineMd}`}>Change</button>
        </div>
      </Section>

      {/* ID Verification */}
      <Section
        title="ID Verification"
        description="Submit an approved ID to verify your account. Your details will be securely used for identity validation."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>

          <button className={DS.buttons.outlineMd}>Verify Identity</button>
        </div>
      </Section>

      {/* Wallet Address */}
      <Section
        title="Wallet address"
        description="The wallet address associated with your account"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            disabled
            value="0xffd4eC9948AEb1e78390D71"
            className="w-full sm:max-w-md rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground border border-border"
          />
          <button
            className={`${DS.buttons.variants.secondary} ${DS.buttons.sizes.md}`}
          >
            Disconnect
          </button>
        </div>
      </Section>

      {/* Payment Wallet */}
      <Section
        title="Payment wallet address"
        description="Payments will be distributed to this wallet address"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            placeholder="0x..."
            className="w-full sm:max-w-md rounded-xl bg-background px-4 py-3 text-sm border border-border focus:ring-2 focus:ring-primary"
          />
          <button className={DS.buttons.primaryMd}>Save</button>
        </div>
      </Section>

      {/* Third-party accounts */}
      <Section title="Third-party accounts" description="Account connections">
        <div className="space-y-4">
          {/* Google */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </div>
            <span className="text-sm text-success font-medium">Connected</span>
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/github.png" alt="GitHub" className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </div>
            <button className={DS.buttons.outlineMd}>Connect</button>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <div className={`${DS.cards.flat} ${DS.cards.padding.md}`}>
        <h3 className="text-sm font-semibold text-error mb-1">Danger zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Delete or disable your account
        </p>
        <button
          className={`${DS.buttons.variants.danger} ${DS.buttons.sizes.md}`}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}

function Security() {
  return <div>Security Settings</div>;
}
function Notifications() {
  return <div>Security</div>;
}
function Organization() {
  return <div>Organization Settings</div>;
}
function Appearance() {
  return <div>Appearance Settings</div>;
}
function Beta() {
  return <div>Beta Features Settings</div>;
}
