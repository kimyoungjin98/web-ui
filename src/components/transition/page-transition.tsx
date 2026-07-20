"use client";

import { useEffect, useState } from "react";
import { Transition } from "./transition";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Transition show={show} preset="fade" duration={220}>
      {children}
    </Transition>
  );
}
