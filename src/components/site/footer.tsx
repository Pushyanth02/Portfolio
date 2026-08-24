import { Clock } from "./clock";

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap foot-in">
        <span>
          © {new Date().getFullYear()} pushyanth · infinity · <Clock /> ist
        </span>
        <span>
          all rights reserved · no copying · set in <b>fraunces</b> · epilogue
          · space mono
        </span>
      </div>
    </footer>
  );
}
