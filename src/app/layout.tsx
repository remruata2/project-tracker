import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Created by Remruata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-primary"
          style={{ color: "white" }}
        >
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon text-white"></span>
          </button>
          <div
            className="offcanvas offcanvas-start"
            id="offcanvasNavbar"
            tabIndex={-1}
            style={{ backgroundColor: "rgb(13, 109, 249)", color: "white" }}
          >
            <div className="offcanvas-header">
              <h5
                className="offcanvas-title text-white"
                id="offcanvasNavbarLabel"
              >
                Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="collapse navbar-collapse">
              <a className="navbar-brand p-2" href="/">
                Project Budget Tracker
              </a>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/budgets">
                    Budgets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/projects">
                    Projects
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/categories">
                    Categories
                  </Link>
                </li>
                {/* Add more links as needed */}
              </ul>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
          integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js"
          integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
