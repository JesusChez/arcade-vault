"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { clearUser, type User } from "@/lib/storage";

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const signOut = () => {
    setOpen(false);
    clearUser();
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="btn ghost auth-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {user.name} ▾
      </button>
      {open && (
        <div className="user-menu-dropdown" role="menu">
          <button type="button" role="menuitem" onClick={signOut}>
            CERRAR SESIÓN
          </button>
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const user = useUser();
  const [open, setOpen] = useState(false);

  const homeActive = pathname === "/";
  const libraryActive = pathname === "/games" || pathname.startsWith("/games/");
  const hallActive = pathname === "/hall-of-fame";
  const aboutActive = pathname === "/about";
  const authActive = pathname === "/login";
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          <Link href="/" className={homeActive ? "active" : ""}>
            Inicio
          </Link>
          <Link href="/games" className={libraryActive ? "active" : ""}>
            Biblioteca
          </Link>
          <Link href="/hall-of-fame" className={hallActive ? "active" : ""}>
            Salón de la Fama
          </Link>
          <Link href="/about" className={aboutActive ? "active" : ""}>
            Acerca de
          </Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link href="/login" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}
        <button type="button" className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menú">
          ≡
        </button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close}></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <Link href="/" className={homeActive ? "active" : ""} onClick={close}>
          Inicio
        </Link>
        <Link href="/games" className={libraryActive ? "active" : ""} onClick={close}>
          Biblioteca
        </Link>
        <Link href="/hall-of-fame" className={hallActive ? "active" : ""} onClick={close}>
          Salón de la Fama
        </Link>
        <Link href="/about" className={aboutActive ? "active" : ""} onClick={close}>
          Acerca de
        </Link>
        <Link href="/login" className={authActive ? "active" : ""} onClick={close}>
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }}></div>
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
