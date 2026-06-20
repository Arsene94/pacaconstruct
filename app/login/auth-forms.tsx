"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  login,
  requestPasswordReset,
  updatePassword,
  type AuthState,
} from "@/app/actions/auth";
import { AuthIcon } from "./auth-icons";
import styles from "./auth.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type FieldVariant = "desktop" | "compact";

type EmailFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  variant: FieldVariant;
};

function EmailField({ id, label, placeholder, variant }: EmailFieldProps) {
  const isCompact = variant === "compact";

  return (
    <div className={styles.formField}>
      <label
        className={cx(styles.formLabel, isCompact && styles.mobileLabel)}
        htmlFor={id}
      >
        {label}
      </label>
      <div
        className={cx(
          styles.fieldShell,
          isCompact ? styles.compactField : styles.desktopField,
        )}
      >
        <AuthIcon className={styles.fieldIcon} name="mail" />
        <input
          autoComplete="email"
          className={cx(
            styles.textInput,
            isCompact ? styles.compactInput : styles.desktopInput,
            styles.emailInput,
          )}
          id={id}
          name="email"
          placeholder={placeholder}
          required
          type="email"
        />
      </div>
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  variant: FieldVariant;
  name?: string;
  autoComplete?: string;
  showForgotLink?: boolean;
};

function PasswordField({
  id,
  label,
  variant,
  name = "password",
  autoComplete = "current-password",
  showForgotLink = false,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isCompact = variant === "compact";

  return (
    <div className={styles.formField}>
      <div className={showForgotLink ? styles.fieldTopRow : undefined}>
        <label
          className={cx(styles.formLabel, isCompact && styles.mobileLabel)}
          htmlFor={id}
        >
          {label}
        </label>
        {showForgotLink ? (
          <Link className={styles.mobileForgot} href="/login/recovery">
            Ai uitat parola?
          </Link>
        ) : null}
      </div>
      <div
        className={cx(
          styles.fieldShell,
          isCompact ? styles.compactField : styles.desktopField,
        )}
      >
        <AuthIcon className={styles.fieldIcon} name="lock" />
        <input
          autoComplete={autoComplete}
          className={cx(
            styles.textInput,
            isCompact ? styles.compactInput : styles.desktopInput,
          )}
          id={id}
          name={name}
          placeholder="••••••••"
          required
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-label={isVisible ? "Ascunde parola" : "Afișează parola"}
          className={styles.passwordToggle}
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          <AuthIcon
            className={styles.passwordToggleIcon}
            name={isVisible ? "visibility" : "visibilityOff"}
          />
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className={styles.errorBox} role="alert">
      <AuthIcon className={styles.errorIcon} name="error" />
      <p className={styles.errorText}>{message}</p>
    </div>
  );
}

type LoginFormProps = {
  state: AuthState;
  formAction: (formData: FormData) => void;
  pending: boolean;
};

function DesktopLogin({ state, formAction, pending }: LoginFormProps) {
  return (
    <section className={styles.desktopShell} aria-label="Portal administratori">
      <aside className={styles.desktopSidebar}>
        <div>
          <div className={styles.brandRow}>
            <AuthIcon className={styles.brandIconLarge} name="architecture" />
            <div className={styles.desktopBrandName}>PACA</div>
          </div>

          <div className={styles.sidebarIntro}>
            <div className={styles.systemBadge}>
              <span className={styles.badgeDot} />
              <span>Sistem Intern de Management</span>
            </div>
            <h1 className={styles.sidebarTitle}>Acces Autorizat</h1>
            <p className={styles.sidebarCopy}>
              Portal restricționat. Autentificarea este permisă doar
              personalului administrativ activ.
            </p>
          </div>
        </div>

        <div className={styles.sessionInfo}>
          <p>Conexiune securizată</p>
          <p>
            ID Sesiune: <span className={styles.mono}>#PC-AUTH-892</span>
          </p>
        </div>
      </aside>

      <div className={styles.desktopMain}>
        <div className={styles.desktopFormCenter}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Autentificare administratori</h2>
              <p className={styles.cardSubtitle}>Introdu datele de acces</p>
            </div>

            {state?.error ? <ErrorBox message={state.error} /> : null}

            <form className={styles.formStack} action={formAction}>
              <EmailField
                id="desktop-email"
                label="Adresă Email"
                placeholder="nume@pacaconstruct.ro"
                variant="desktop"
              />
              <PasswordField
                id="desktop-password"
                label="Parolă"
                variant="desktop"
              />

              <div className={styles.desktopOptions}>
                <label className={styles.rememberLabel}>
                  <span className={styles.rememberControl}>
                    <input
                      className={styles.rememberInput}
                      name="remember"
                      type="checkbox"
                    />
                    <AuthIcon className={styles.rememberCheck} name="check" />
                  </span>
                  <span>Păstrează sesiunea</span>
                </label>
                <Link className={styles.forgotLink} href="/login/recovery">
                  Ai uitat parola?
                </Link>
              </div>

              <button
                className={cx(styles.submitButton, styles.desktopSubmit)}
                disabled={pending}
                type="submit"
              >
                <span>{pending ? "Se autentifică…" : "Autentifică-te"}</span>
                <AuthIcon className={styles.submitIcon} name="arrowForward" />
              </button>
            </form>
          </div>
        </div>

        <footer className={styles.loginFooter}>
          <p className={styles.copyright}>
            © 2024 PACA CONSTRUCT | INTERNAL SYSTEMS
          </p>
          <nav className={styles.loginFooterNav} aria-label="Linkuri portal">
            <a className={styles.footerLink} href="mailto:office@pacaconstruct.ro">
              Technical Support
            </a>
            <Link className={styles.footerLink} href="/login">
              Security Protocol
            </Link>
          </nav>
        </footer>
      </div>
    </section>
  );
}

function MobileLogin({ state, formAction, pending }: LoginFormProps) {
  return (
    <section className={styles.mobileShell} aria-label="Autentificare mobil">
      <main className={styles.mobileMain}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileBrand}>PACA CONSTRUCT</h1>
          <p className={styles.mobileSystem}>Sistem Intern de Management</p>
        </header>

        <div className={styles.mobileCard}>
          <div className={styles.mobileAccent} />
          <div className={styles.mobileCardBody}>
            <h2 className={styles.mobileCardTitle}>Autentificare</h2>

            {state?.error ? <ErrorBox message={state.error} /> : null}

            <form className={styles.formStack} action={formAction}>
              <EmailField
                id="mobile-email"
                label="Adresă de Email"
                placeholder="nume@pacaconstruct.ro"
                variant="compact"
              />
              <PasswordField
                id="mobile-password"
                label="Parolă"
                showForgotLink
                variant="compact"
              />

              <button
                className={cx(styles.submitButton, styles.mobileSubmit)}
                disabled={pending}
                type="submit"
              >
                <span>{pending ? "Se autentifică…" : "Autentifică-te"}</span>
                <AuthIcon className={styles.submitIcon} name="login" />
              </button>
            </form>
          </div>

          <div className={styles.secureStrip}>
            <AuthIcon className={styles.secureIcon} name="verified" />
            <span className={styles.secureText}>Conexiune securizată SSL</span>
          </div>
        </div>

        <div className={styles.mobileSupportWrap}>
          <a className={styles.supportLink} href="mailto:office@pacaconstruct.ro">
            <AuthIcon className={styles.supportIcon} name="support" />
            <span>Suport tehnic</span>
          </a>
        </div>
      </main>
    </section>
  );
}

export function LoginExperience() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className={styles.authPage}>
      <DesktopLogin state={state} formAction={formAction} pending={pending} />
      <MobileLogin state={state} formAction={formAction} pending={pending} />
    </div>
  );
}

function RecoveryEmailField() {
  return (
    <EmailField
      id="recovery-email"
      label="Adresă de email"
      placeholder="nume.prenume@pacaconstruct.ro"
      variant="compact"
    />
  );
}

function ForgotPasswordScreen({
  state,
  formAction,
  pending,
}: {
  state: AuthState;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <main className={styles.recoveryMain} id="screen-forgot-password">
      <div className={styles.recoveryCard}>
        <header className={styles.recoveryHeader}>
          <h1 className={styles.recoveryBrand}>PACA CONSTRUCT</h1>
          <p className={styles.recoverySystem}>Sistem de Acces Restricționat</p>
          <div className={styles.divider} />
        </header>

        <div className={styles.recoveryIntro}>
          <h2 className={styles.recoveryTitle}>Recuperează accesul</h2>
          <p className={styles.recoveryCopy}>
            Introduceți adresa de email asociată contului dumneavoastră
            operațional pentru a primi instrucțiunile de resetare.
          </p>
        </div>

        {state?.error ? <ErrorBox message={state.error} /> : null}

        <form className={styles.recoveryForm} action={formAction}>
          <RecoveryEmailField />

          <button
            className={cx(styles.submitButton, styles.recoverySubmit)}
            disabled={pending}
            type="submit"
          >
            <span>{pending ? "Se trimite…" : "Trimite instrucțiunile"}</span>
            <AuthIcon className={styles.submitIcon} name="arrowForward" />
          </button>

          <div className={styles.recoveryBackArea}>
            <Link className={styles.recoveryBackLink} href="/login">
              <AuthIcon className={styles.backIcon} name="arrowBack" />
              <span>Înapoi la autentificare</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function SuccessScreen() {
  return (
    <main className={styles.recoveryMain} id="screen-success">
      <div className={cx(styles.recoveryCard, styles.recoveryCardSuccess)}>
        <header className={styles.recoveryHeader}>
          <AuthIcon className={styles.successIcon} name="checkCircle" />
          <h1 className={styles.successTitle}>Solicitare Trimisă</h1>
          <div className={styles.divider} />
        </header>

        <div className={styles.successCopyWrap}>
          <p className={styles.recoveryCopy}>
            Dacă există un cont asociat adresei introduse, vei primi
            instrucțiunile pentru resetarea parolei în scurt timp.
          </p>
        </div>

        <div className={styles.recoveryBackArea}>
          <Link
            className={cx(styles.submitButton, styles.recoverySubmit)}
            href="/login"
          >
            <AuthIcon className={styles.backIcon} name="arrowBack" />
            <span>Înapoi la autentificare</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export function UpdatePasswordExperience() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    undefined,
  );

  return (
    <div className={styles.recoveryPage}>
      <main className={styles.recoveryMain}>
        <div className={styles.recoveryCard}>
          <header className={styles.recoveryHeader}>
            <h1 className={styles.recoveryBrand}>PACA CONSTRUCT</h1>
            <p className={styles.recoverySystem}>Sistem de Acces Restricționat</p>
            <div className={styles.divider} />
          </header>

          <div className={styles.recoveryIntro}>
            <h2 className={styles.recoveryTitle}>Setează parola nouă</h2>
            <p className={styles.recoveryCopy}>
              Alege o parolă nouă de minimum 8 caractere pentru contul tău
              administrativ.
            </p>
          </div>

          {state?.error ? <ErrorBox message={state.error} /> : null}

          <form className={styles.recoveryForm} action={formAction}>
            <PasswordField
              id="new-password"
              label="Parolă nouă"
              variant="compact"
              name="password"
              autoComplete="new-password"
            />
            <PasswordField
              id="confirm-password"
              label="Confirmă parola"
              variant="compact"
              name="confirmPassword"
              autoComplete="new-password"
            />

            <button
              className={cx(styles.submitButton, styles.recoverySubmit)}
              disabled={pending}
              type="submit"
            >
              <span>{pending ? "Se salvează…" : "Salvează parola"}</span>
              <AuthIcon className={styles.submitIcon} name="arrowForward" />
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.recoveryFooter}>
        <p className={styles.recoveryCopyright}>
          © 2024 PACA CONSTRUCT | INTERNAL SYSTEMS
        </p>
      </footer>
    </div>
  );
}

export function RecoveryExperience() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  return (
    <div className={styles.recoveryPage}>
      {state?.success ? (
        <SuccessScreen />
      ) : (
        <ForgotPasswordScreen
          state={state}
          formAction={formAction}
          pending={pending}
        />
      )}

      <footer className={styles.recoveryFooter}>
        <p className={styles.recoveryCopyright}>
          © 2024 PACA CONSTRUCT | INTERNAL SYSTEMS
        </p>
        <nav
          className={styles.recoveryFooterNav}
          aria-label="Linkuri recovery"
        >
          <a className={styles.footerLink} href="mailto:office@pacaconstruct.ro">
            Technical Support
          </a>
          <Link className={styles.footerLink} href="/login/recovery">
            Security Protocol
          </Link>
          <Link className={styles.footerLink} href="/login">
            Legal
          </Link>
        </nav>
      </footer>
    </div>
  );
}
